import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qgkqyzajbimtgyvemcru.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFna3F5emFqYmltdGd5dmVtY3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE2ODg1ODcsImV4cCI6MTk3NzI2NDU4N30.R6mlRtU80sFbk8fZu5VZcBdkZFPNHduGwxWjY_AFmvo";
export const supabase = createClient(supabaseUrl, supabaseKey);
