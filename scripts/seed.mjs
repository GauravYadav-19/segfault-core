import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log("🚀 Initiating SegFault Data Ingestion Pipeline...\n");

  const problemsPath = path.resolve(__dirname, 'problems.json');
  const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf-8'));

  for (const problem of problemsData) {
    console.log(`📡 Processing: [${problem.slug}]`);

    // 1. Insert Metadata into Postgres (The Index)
    const { error: dbError } = await supabase
      .from('problems')
      .upsert({
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description
      }, { onConflict: 'slug' });

    if (dbError) {
      console.error(`❌ Database Error for ${problem.slug}:`, dbError.message);
      continue;
    }
    console.log(`   ✅ Metadata injected into Postgres.`);

    // 2. Upload Drivers & Boilerplates to S3 Storage (The Vault)
    const engineData = {
      boilerplates: problem.boilerplates,
      drivers: problem.drivers
    };

    const fileName = `${problem.slug}/engine.json`;
    const { error: storageError } = await supabase.storage
      .from('problem-vault')
      .upload(fileName, JSON.stringify(engineData), {
        contentType: 'application/json',
        upsert: true
      });

    if (storageError) {
      console.error(`❌ Storage Error for ${problem.slug}:`, storageError.message);
    } else {
      console.log(`   ✅ Execution Engine files uploaded to Storage Vault.\n`);
    }
  }

  console.log("🏁 Data Ingestion Complete.");
}

seedDatabase();