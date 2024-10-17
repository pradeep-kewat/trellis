/* eslint-disable no-unused-vars */
"use client";

import {
  fetchDashboardCommunitiesKPI,
  fetchDashboardPostsKPI,
  fetchDashboardUsers,
  fetchDashboardUsersCount,
  fetchDashboardUsersKPI,
  fetchKPIForLast4Weeks,
} from "@/app/actions/DashboardActions";
import KpiComponent from "@/components/Kpi";
import LineChart from "@/components/LineChart";
import TableComponent from "@/components/Table";
import { Header } from "@/types/table";
import { dashboardKpi } from "@/utils/global";
import { Flex, SimpleGrid, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const headers: Header = {
  name: "Reports",
  hasFilters: false,
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "username", columnName: "User Name", type: "String", tooltip: true },
    { id: "email_id", columnName: "Email", type: "Email", tooltip: true },
    { id: "country", columnName: "Country", type: "String" },
    { id: "age_group", columnName: "Age Group", type: "String" },
    { id: "profession", columnName: "Profession", type: "String" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    { id: "status", columnName: "Status", type: "Status" },
  ],
};

const Dashboard = () => {
  const [kpiData, setKpiData] = useState(dashboardKpi);
  const [lineGraphData, setLineGraphData]: any = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 780px)");

  const datasets = [
    {
      label: "Users",
      data: lineGraphData?.data?.map((item: any) => item.userCount),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderWidth: 2,
      fill: true,
    },
    {
      label: "Communities",
      data: lineGraphData?.data?.map((item: any) => item.communityCount),
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderWidth: 2,
      fill: true,
    },
    {
      label: "Posts",
      data: lineGraphData?.data?.map((item: any) => item.postCount),
      borderColor: "rgba(255, 159, 64, 1)",
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      borderWidth: 2,
      fill: true,
    },
    {
      label: "Reports",
      data: lineGraphData?.data?.map((item: any) => item.reportCount),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderWidth: 2,
      fill: true,
    },
  ];

  const labels = lineGraphData?.data?.map((item: any) => item.week);

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          callback: function (
            value: string | number,
            index: number,
            ticks: any
          ) {
            const dateStr = labels[index];
            const [year, month, day] = dateStr.split("-");
            return `${day}-${month}-${year}`;
          },
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 5,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "KPI Data for Last 4 Weeks",
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems: any) {
            const index = tooltipItems[0].dataIndex;
            const dateStr = labels[index];
            const [year, month, day] = dateStr.split("-");
            return `${day}-${month}-${year}`;
          },
        },
      },
    },
  };

  const fetchDashboardGraphData = async () => {
    const data = await fetchKPIForLast4Weeks();
    setLineGraphData(data);
  };

  const fetchKpiData = async () => {
    try {
      const [usersKPI, communitiesKPI, postsKPI] = await Promise.all([
        fetchDashboardUsersKPI(),
        fetchDashboardCommunitiesKPI(),
        fetchDashboardPostsKPI(),
      ]);

      setKpiData((prevKpiData) =>
        prevKpiData.map((kpi) => {
          if (kpi.id === "usersCount") {
            return {
              ...kpi,
              loading: false,
              value: usersKPI.count,
              percentage: Number(usersKPI.percentageDifference),
            };
          }
          if (kpi.id === "communitiesCount") {
            return {
              ...kpi,
              loading: false,
              value: communitiesKPI.count,
              percentage: Number(communitiesKPI.percentageDifference),
            };
          }
          if (kpi.id === "postsCount") {
            return {
              ...kpi,
              loading: false,
              value: postsKPI.count,
              percentage: Number(postsKPI.percentageDifference),
            };
          }
          return kpi;
        })
      );
    } catch (error) {
      console.error("Failed to fetch KPI data", error);
    }
  };

  useEffect(() => {
    fetchKpiData();
    fetchDashboardGraphData();
  }, []);

  const fetchTableCount = async (payload: any) => {
    return (await fetchDashboardUsersCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) =>
    (await fetchDashboardUsers(payload)).data || [];

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <SimpleGrid width={"100%"} columns={{ laptop: 3 }} gap="20px" mb={4}>
        {kpiData.map((kpi) => (
          <KpiComponent key={kpi.id} {...kpi} />
        ))}
      </SimpleGrid>
      <Flex height={isMobile ? "300px" : "400px"} width={"100%"}>
        <LineChart data={datasets} labels={labels} options={options} />
      </Flex>
      <TableComponent
        title={"Recently Added"}
        searchPlaceholder="Search by username/email"
        headers={headers}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
      />
    </Flex>
  );
};

export default Dashboard;
