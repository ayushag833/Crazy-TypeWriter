import BgGradient from "@/components/common/bg-gradient";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <section className="flex justify-center items-center py-16 gap-[5rem]">
      <BgGradient>
        <SignUp />
      </BgGradient>
      <Image src="https://images.pexels.com/photos/312839/pexels-photo-312839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
       width={500}
       height={500}
       alt="Study Picture"
       className="w-[55rem] h-[35rem] object-cover object-top rounded-lg"/>
    </section>
  );
}
