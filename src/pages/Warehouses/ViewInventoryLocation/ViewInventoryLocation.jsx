import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { message, Tree, Typography, Card } from "antd";

const { Text } = Typography;

function ViewInventoryLocation() {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const location = useLocation();
  const { inventoryID } = location.state;

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7200/api/location/get/${inventoryID}`
        );
        const data = await response.json();
        if (response.ok) {
          const {
            warehouseName,
            floorName,
            roomName,
            aisleName,
            shelfName,
            binName,
          } = data.result;
          setTreeData([
            {
              title: <Text style={{ fontSize: "20px" }}>{warehouseName}</Text>,
              key: "0",
              children: [
                {
                  title: <Text style={{ fontSize: "20px" }}>{floorName}</Text>,
                  key: "0-0",
                  children: [
                    {
                      title: (
                        <Text style={{ fontSize: "20px" }}>{roomName}</Text>
                      ),
                      key: "0-0-0",
                      children: [
                        {
                          title: (
                            <Text style={{ fontSize: "20px" }}>
                              {aisleName}
                            </Text>
                          ),
                          key: "0-0-0-0",
                          children: [
                            {
                              title: (
                                <Text style={{ fontSize: "20px" }}>
                                  {shelfName}
                                </Text>
                              ),
                              key: "0-0-0-0-0",
                              children: [
                                {
                                  title: (
                                    <Text style={{ fontSize: "20px" }}>
                                      {binName}
                                    </Text>
                                  ),
                                  key: "0-0-0-0-0-0",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ]);
          setExpandedKeys([
            "0",
            "0-0",
            "0-0-0",
            "0-0-0-0",
            "0-0-0-0-0",
            "0-0-0-0-0-0",
          ]);
        } else {
          message.error("Failed to fetch location data.");
        }
      } catch (error) {
        message.error("An error occurred while fetching location data.");
      }
    };

    fetchLocationData();
  }, [inventoryID]);

  return (
    <Card
      title="Inventory Location"
      style={{ width: "100%", margin: "20px auto", borderRadius: "8px" }}
      bodyStyle={{ padding: "20px" }}
    >
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        style={{ fontSize: "20px" }}
      />
    </Card>
  );
}

export default ViewInventoryLocation;
