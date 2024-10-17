"use client";

import TabsComponent from "@/components/Tabs";
import MasterCountries from "./masterCountries";
import MasterInterests from "./masterInterests";
import MasterTraits from "./masterTraits";
import MasterReport from "./masterReports";
import MasterSkills from "./masterSkills";

const MasterFields = () => {
  const tabsConfig = [
    { label: "Countries", content: <MasterCountries /> },
    { label: "Interests", content: <MasterInterests /> },
    { label: "Personality Traits", content: <MasterTraits /> },
    { label: "Report Reasons", content: <MasterReport /> },
    { label: "Skills", content: <MasterSkills /> },
  ];
  return (
    <>
      <TabsComponent tabsConfig={tabsConfig} />
    </>
  );
};

export default MasterFields;
