import BgGradient from "@/components/common/bg-gradient";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <section className="flex justify-center items-center py-16 gap-[5rem]">
      <BgGradient>
        <SignIn />
      </BgGradient>
      <Image src="https://images.pexels.com/photos/33582/sunrise-phu-quoc-island-ocean.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
       width={500}
       height={500}
       alt="Study Picture"
       className="w-[55rem] h-[32rem] object-cover object-bottom rounded-lg"/>
    </section>
  );
}
