import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

import { redirect } from "next/navigation";

const Home = async () => {
  const user = await getCurrent();

  if (!user) {
    console.warn("No user found. Redirecting...");
    redirect("/sign-in");
  }

  const workspaces = await getWorkspaces();
  console.log({ workspaces });
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
};

export default Home;
