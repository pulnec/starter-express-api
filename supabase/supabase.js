import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://dseupmzidiqwyqcuccrx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZXVwbXppZGlxd3lxY3VjY3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNjgyNjUsImV4cCI6MTk4OTg0NDI2NX0.Tvbd6nyFFYsGN6HxLY5yQ7EhuqOgYbPDaN4UuAPuJIk"
);

export const getTableData = async () => {
  const { data, error } = await supabase.from("dolar_blue").select("*");
  console.log("data", data);
  console.log("error", error);
};
