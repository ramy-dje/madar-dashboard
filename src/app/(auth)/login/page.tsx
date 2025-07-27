import Image from "next/image";
import LoginFrom from "./_components/login-from";

export default function LoginPage() {
  return (
    <main className="w-full flex h-screen">
      {/* the auth from */}
      <div className="w-full flex justify-center items-center p-6 lg:p-14 h-full lg:w-2/5">
        <LoginFrom />
      </div>

      {/* the image */}
      <div className="hidden lg:flex items-end w-3/5 py-5 md:py-10 pr-10 h-full">
        <div
          style={{ backgroundImage: "url('/36304133_8271520(2).jpg')" }}
          className="w-full h-full bg-cover overflow-hidden bg-center rounded-xl"
        >
          <div className="w-full h-full flex justify-center items-center backdrop-blur-sm bg-primary/60">
            <Image src="/madar_logo.svg" alt="logo" width={500} height={200} />
          </div>
        </div>
      </div>
    </main>
  );
}
