'use client'
import React, { useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler, } from "chart.js";
import { Bar } from "react-chartjs-2";
import { fetchUserCountByMonth } from "@/redux/actions/userAction";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler );

const UserChart = () => {

  const dispatch = useAppDispatch()
  const {count} = useAppSelector((state) => state.user)
  console.log(count)
  useEffect(()=>{
    const fetchCount = async() => {
      const res = await dispatch(fetchUserCountByMonth())
      console.log(res)

    }
    fetchCount()
  },[dispatch])

  const labels = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug","Sep","Oct","Nov","Dec"];
  const datasets = count;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "User Joined (2025)",
        data: datasets,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          
        ],
        borderWidth: 1,
        barPercentage: 1,
        borderRadius: {
          topLeft: 5,
          topRight: 5,
        },
      },
      // insert similar in dataset object for making multi bar chart
    ],
  };
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: "User Joined",
        },
        display: true,
        beginAtZero: true,
        max: 100,
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
        display: true,
      },
    },
  };
  return (
    <div className="cursor-pointer" style={{ width: "1000px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserChart;