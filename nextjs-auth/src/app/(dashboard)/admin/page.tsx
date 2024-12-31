import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const page = async () => {
    const session = await getServerSession(authOptions);
    console.log(session);

    if(session?.user){
        return <h2 className="'text-2xl"> Welcome to the main Admin Dashboard! {session?.user.username}</h2>;
    }

  return(
    <h2 className="'text-2xl"> Please login to see this admin </h2>
)
};

export default page
