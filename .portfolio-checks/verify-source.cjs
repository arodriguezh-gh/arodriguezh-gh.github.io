// Dependency-free checks. These verify content and paths, not browser layout.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(process.argv[2] || '.');
const source = fs.readFileSync(path.join(root,'js/data.js'),'utf8');
const display = fs.readFileSync(path.join(root,'js/display.js'),'utf8');
const data = vm.runInNewContext(source+'\nportfolio;');
const results = [];
const check = (name,pass) => {results.push({name,pass:!!pass});};
check('Expected project hierarchy', data.projects.map(p=>p.id).join(',')==='agrored,greenlining,consulting,sun-works,association-house');
check('One sentence for each principle',data.principles.length===5 && data.principles.every(p=>p.text.split(/[.!?]+/).filter(Boolean).length===1));
check('Four supplied About paragraphs',data.about.paragraphs.length===4);
check('Real CV file',fs.existsSync(path.join(root,data.owner.cvUrl)));
check('Email preserved',data.owner.email==='a_rodriguezh@berkeley.edu');
check('LinkedIn preserved',data.owner.linkedin==='https://www.linkedin.com/in/alejandrorodriguezhern%C3%A1ndez/');
check('No document.write',!display.includes('document.write('));
for(const [key,image] of Object.entries(data.media)) {
    if(image.src) check('Real image: '+key,fs.existsSync(path.join(root,image.src)) && image.alt.length>10);
    else check('Planned slot: '+key,Boolean(image.role&&image.shape));
}
// Run the real template functions with a small DOM surface, collecting the markup
// they produce. Event handling and responsive behavior still require a browser.
function render(file,dataset={}) {
    const html = fs.readFileSync(path.join(root,file),'utf8');
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
    const containers = Object.fromEntries(ids.filter(id=>!['contact-form','prepare-email','form-status','email-draft','site-navigation'].includes(id)).map(id=>[id,{innerHTML:''}]));
    const noop = ()=>{};
    const control = {addEventListener:noop,setAttribute:noop,classList:{add:noop,remove:noop,toggle:noop},querySelector(){return control;}};
    const document = {
        baseURI:'http://test.local/'+file,
        body:{dataset,append:noop,classList:control.classList},
        getElementById(id){return containers[id]||null;},
        querySelector(){return null;},querySelectorAll(){return [];},
        createElement(){return {...control};},addEventListener:noop
    };
    const context = {document,window:{location:{hash:''}},URL,console,requestAnimationFrame:noop};
    const scripts = [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(match => fs.readFileSync(path.resolve(root,path.dirname(file),match[1]),'utf8'));
    vm.runInNewContext(scripts.join('\n'),context);
    return html+Object.values(containers).map(c=>c.innerHTML).join('');
}
const generated={};
for(const file of ['index.html','projects.html']) {
    const html=render(file);
    generated[file]=html;
    check(file+': one page heading',(html.match(/<h1[\s>]/g)||[]).length===1);
    const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
    check(file+': unique IDs',new Set(ids).size===ids.length);
    check(file+': production independent of preview/checks',!html.includes('.portfolio-preview/')&&!html.includes('.portfolio-checks/'));
    check(file+': all image alt text',![...html.matchAll(/<img\b[^>]*>/g)].some(m=>!m[0].includes('alt="')));
    check(file+': paired main landmark',(html.match(/<main\b/g)||[]).length===1&&(html.match(/<\/main>/g)||[]).length===1);
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url=new URL(match[1].replaceAll('&amp;','&'),'http://test.local/'+file);
        if(url.origin!=='http://test.local')continue;
        const target=url.pathname.slice(1);
        check(file+': dependency '+target,fs.existsSync(path.join(root,target)));
        if(url.hash) {
            const targetHTML=target===file?html:(generated[target]||render(target));
            check(file+': anchor '+url.hash,targetHTML.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'));
        }
    }
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const expectedOrder=['about','work','experience','background','education','development-definition','volunteering','community-content','values','research','skills','contact'];
check('Requested homepage order',expectedOrder.every((id,i)=>home.indexOf('id="'+id+'"')>=0 && (!i || home.indexOf('id="'+id+'"')>home.indexOf('id="'+expectedOrder[i-1]+'"'))));
check('Experience closes the Work section',home.slice(home.indexOf('id="work"'),home.indexOf('id="contact"')).includes('id="experience"'));
check('Portrait remains in About',home.slice(home.indexOf('id="about"'),home.indexOf('id="background"')).includes('id="about-portrait"'));
check('Community introduces values',data.about.community.stories.length===2 && home.indexOf('id="volunteering"')<home.indexOf('id="values"'));
check('AgroRed consistent 804 count',data.projects[0].homeMetric.value==='804' && data.projects[0].caseStudy.processes[0].steps[0].title==='804 initiatives' && !source.includes('4,300'));
const organizationURLs=['https://greenlining.org','https://www.associationhouse.org','https://nysunworks.org','https://oportunidadestrategica.com'];
check('Employer website destinations',data.experience.every((item,i)=>item.url===organizationURLs[i]));
for (const item of [...data.experience,...data.education]) check('Local organization logo: '+(item.organization||item.institution),fs.existsSync(path.join(root,item.logo)));
check('Three linked degree programs',data.education.flatMap(item=>item.programs).length===3);
for (const file of ['index.html','projects.html']) {
    const html=fs.readFileSync(path.join(root,file),'utf8');
    const nav=html.match(/<ul class="nav-links">([\s\S]*?)<\/ul>/)[1];
    const base=file==='index.html'?'':'index.html';
    check(file+': navigation order and destinations',[...nav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).join(',')===[base+'#about',base+'#work',base+'#background','projects.html',base+'#contact'].join(','));
    check(file+': Projects button differentiated',nav.includes('class="nav-projects"'));
}
check('Homepage positioning omits nationality',!generated['index.html'].includes('Colombian'));
check('Homepage retains Colombia project context',generated['index.html'].includes('AgroRed Colombia'));
check('Five accessible orchid buttons',(generated['index.html'].match(/class="orchid-petal" role="button" tabindex="0"/g)||[]).length===5);
check('Values popup is a labelled native dialog',generated['index.html'].includes('<dialog id="values-dialog"')&&generated['index.html'].includes('aria-describedby="values-dialog-text"'));
check('Methods visible without disclosures',!generated['index.html'].includes('<details class="skill-group'));
check('Both volunteering quotes are HTML',data.about.community.stories.every(s=>generated['index.html'].includes(s.quote)));
check('Two explicitly academic research interests',data.research.items.length===2&&data.research.label.includes('academic'));
check('Contact form action retained',home.includes('action="#" method="post"'));
check('Explicit label for each form input',[...home.matchAll(/<(?:input|textarea)[^>]*id="([^"]+)"/g)].every(m=>home.includes('for="'+m[1]+'"')));
for(const filename of ['base','layout','components','responsive']) {
    const css=fs.readFileSync(path.join(root,'css/'+filename+'.css'),'utf8');
    check(filename+': balanced rule blocks',(css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length);
}
const directionRoot=fs.existsSync(path.join(root,'directions'))?'directions':'.portfolio-preview/directions';
for(const direction of ['a','b','c']) {
    const file=directionRoot+'/'+direction+'.html';
    const dataset={direction,assetBase:directionRoot==='directions'?'../':'../../',siteBase:directionRoot==='directions'?'../':'../../'};
    const output=render(file,dataset);
    check('Direction '+direction+': only flagship',(output.match(/class="project-card /g)||[]).length===1);
    check('Direction '+direction+': archived hero preserved',output.includes('Understanding systems.')&&output.includes('Expanding opportunity.'));
    for(const match of output.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url=new URL(match[1],'http://test.local/'+file);
        if(url.origin==='http://test.local')check('Direction '+direction+': '+url.pathname,fs.existsSync(path.join(root,url.pathname.slice(1))));
    }
}
// Compare authored prose, excluding media metadata, labels, and code.
const baseline = path.join(__dirname,'prototype-v1/data.js');
const before = fs.existsSync(baseline) ? vm.runInNewContext(fs.readFileSync(baseline,'utf8')+'\nportfolio;') : null;
const words=text=>text.trim().split(/\s+/).length;
const oldCount=before ? words([before.owner.introduction,before.owner.purpose,...before.about.paragraphs,...before.principles.map(p=>p.text),...before.projects.flatMap(p=>[p.summary,p.capability])].join(' ')) : null;
const newCount=words([data.owner.introduction,...data.about.paragraphs,...data.principles.map(p=>p.text),...data.projects.map(p=>p.summary)].join(' '));
const failures=results.filter(r=>!r.pass);
console.log(JSON.stringify({root,checks:results.length,passed:results.length-failures.length,failures,homepageProse:oldCount ? {before:oldCount,after:newCount,reduction:Math.round((1-newCount/oldCount)*100)+'%'} : undefined},null,2));
if(failures.length) process.exitCode=1;
