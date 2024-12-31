import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn
        forceRedirectUrl={"/icc-aslan-dashboard/icc-aslan-dashboard"}
        fallbackRedirectUrl={"/icc-aslan-dashboard/icc-aslan-dashboard"}
      />
    </div>
  );
}
