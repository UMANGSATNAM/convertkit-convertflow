import { compileTheme } from './app/services/theme-engine/compiler.server.ts';
import prisma from './app/db.server.ts';

async function run() {
  const blueprint = { pages: { index: { sections: [{ componentId: 'hero-editorial-v1', settings: {} }] } }, settings: {} };
  const components = await prisma.componentRegistry.findMany({ where: { status: 'PUBLISHED' } });
  
  console.log('Found components in DB:', components.length);
  
  const compileResult = await compileTheme(blueprint, components, { industry: 'default' });
  
  console.log('filesToUpload length:', Object.keys(compileResult.filesToUpload).length);
  
  const uploadBundleFiles = compileResult.uploadBundle.sections.length + 
                            compileResult.uploadBundle.snippets.length + 
                            compileResult.uploadBundle.assets.length + 
                            compileResult.uploadBundle.locales.length + 
                            compileResult.uploadBundle.config.length + 
                            compileResult.uploadBundle.templates.length + 
                            compileResult.uploadBundle.layout.length;
  console.log('uploadBundle length:', uploadBundleFiles);
  process.exit(0);
}

run().catch(e => { 
  console.error('ERROR:', e.message); 
  process.exit(1); 
});
