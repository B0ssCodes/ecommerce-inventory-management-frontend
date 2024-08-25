import React, { useEffect, useState } from "react";
import { Card, Statistic, message } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

const TransactionCount = () => {
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    const fetchTransactionCount = async () => {
      try {
        const response = await fetch(
          "https://localhost:7200/api/transaction/getCount"
        );
        const data = await response.json();
        if (response.ok) {
          setTransactionCount(data.result);
        } else {
          message.error("Failed to fetch transaction count.");
        }
      } catch (error) {
        message.error("An error occurred while fetching transaction count.");
      }
    };

    fetchTransactionCount();
  }, []);

  return (
    <Card
      title="Outbound Transactions This Month"
      style={{ width: "50%", margin: "20px auto", textAlign: "center" }}
    >
      <Statistic
        value={transactionCount}
        precision={0}
        valueStyle={{ color: "#3f8600", fontSize: "24px" }}
        prefix={<ArrowUpOutlined />}
        suffix="transactions"
      />
    </Card>
  );
};

export default TransactionCount;
