import { useEffect } from "react";

const useHeader = ({ data }) => {
  useEffect(() => {
    if (!data) return;
    const { getCustomizations } = data;
    const {
      leadcolor1,
      colorfontbuttons,
      colorhd,
      colorhdfont,
      colorhdfonthover,
      customcss
    } = getCustomizations;
    document.documentElement.style.setProperty("--leadcolor1", leadcolor1);
    document.documentElement.style.setProperty(
      "--colorfontbuttons",
      colorfontbuttons
    );
    document.documentElement.style.setProperty("--colorhd", colorhd);
    document.documentElement.style.setProperty("--colorhdfont", colorhdfont);
    document.documentElement.style.setProperty(
      "--colorhdfonthover",
      colorhdfonthover
    );
    var sheet = document.createElement("style");
    sheet.innerHTML = customcss;
    document.body.appendChild(sheet);
  }, [data]);
};

export default useHeader;
