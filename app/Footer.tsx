import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-neutral text-neutral-content">
      <div>
        <svg
          width="24"
          height="34"
          viewBox="0 0 24 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.27749 0.00106247L2.55736 3.96938H0V7.5382H0.978532L1.98044 13.8864H0.415424L2.48511 25.5449L3.81213 25.529L5.14659 34H17.7804L17.8686 33.4358L19.1138 25.5279L20.376 25.5438L22.4404 13.8854H20.9455L21.941 7.53714H23.0152V3.96831H20.2984L18.5719 0L4.27749 0.00106247ZM5.02547 1.14109H17.8356L18.9247 3.66445H3.92794L5.02547 1.14109ZM1.13046 5.10409H21.8751V6.4088H1.13046V5.10409ZM1.77219 15.0201H21.091L19.4251 24.3942L11.4183 24.3103L3.43814 24.3942L1.77219 15.0201Z"
            fill="#D8DDE4"
          />
        </svg>
        <p className="font-bold">
          SOPLAY Brewing community. <br />
          Providing since 2023
        </p>
        <p>Copyright © 2023 - All right reserved</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <Link
            href={"https://github.com/soplay"}
            prefetch={false}
            aria-label={"개발자 깃허브 링크"}
            target="_blank"
          >
            <FaGithub className="text-3xl" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
