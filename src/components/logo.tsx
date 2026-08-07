import logo from "@/assets/sbf-logo.png";

export function Logo({ className = "size-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="SBF Golf Tour 2027 crest with crossed golf clubs"
      width={1024}
      height={1024}
      className={`${className} shrink-0 object-contain`}
    />
  );
}
