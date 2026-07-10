// import WaxSeal from "../shared/WaxSeal";
import NavGroup from "../shared/NavGroup";
// import useIsMobile from "../../hooks/useIsMobile";
import "./Footer.css";

function Footer({ year = 2026, brand = "THE CHROME PILGRIM" }) {
  // const isMobile = useIsMobile();

  return (
    <footer className="footer">
      {/* <WaxSeal size={isMobile ? 32 : 46} opacity={0.7} /> */}
      <div className="footer__nav">
        <NavGroup
          links={[
            {
              label: "CONTACT",
              href: "/contact",
              icon: "fa fa-envelope",
            },
            {
              label: "INSTAGRAM",
              href: "https://instagram.com/danisveryown",
              icon: "fab fa-instagram",
              external: true,
            },
          ]}
        />
      </div>
      <div className="footer__copyright">
        {toRoman(year)} &nbsp;·&nbsp; {brand}
      </div>
    </footer>
  );
}

function toRoman(num) {
  const map = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let n = num;
  for (const [value, symbol] of map) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

export default Footer;
