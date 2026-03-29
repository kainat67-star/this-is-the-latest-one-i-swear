import { useEffect } from "react";
import { getSupabase } from "@/lib/supabaseClient";

export default function TestEdgeFunction() {
  const supabase = getSupabase();

  useEffect(() => {
    const test = async () => {
      console.log("Testing edge function...");

      try {
        const { data, error } = await supabase.functions.invoke("google-ads-auth", {
          body: {
            code: "test_code",
            userId: "test_user",
          },
        });
        console.log("Data:", JSON.stringify(data));
        console.log("Error:", JSON.stringify(error));
      } catch (err: any) {
        console.log("Caught:", err.message);
      }
    };
    void test();
  }, []);

  return <div>Check browser console for results</div>;
}
