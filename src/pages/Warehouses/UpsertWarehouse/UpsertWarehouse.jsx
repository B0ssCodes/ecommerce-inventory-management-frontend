import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const CreateWarehouse = () => {
  const [warehouse, setWarehouse] = useState({
    warehouseName: "",
    warehouseAddress: "",
    floors: [],
  });
  const navigate = useNavigate();
  const location = useLocation();
  const warehouseID = location.state?.warehouseID;

  useEffect(() => {
    if (warehouseID) {
      const fetchWarehouse = async () => {
        try {
          const response = await fetch(
            `https://localhost:7200/api/warehouse/get/${warehouseID}`
          );
          const data = await response.json();
          if (response.ok) {
            setWarehouse(data.result);
          } else {
            message.error("Failed to fetch warehouse data.");
          }
        } catch (error) {
          message.error("An error occurred while fetching the warehouse data.");
        }
      };
      fetchWarehouse();
    }
  }, [warehouseID]);

  const handleAddFloor = () => {
    setWarehouse({
      ...warehouse,
      floors: [...warehouse.floors, { floorName: "", rooms: [] }],
    });
  };

  const handleRemoveFloor = (index) => {
    const newFloors = warehouse.floors.filter((_, i) => i !== index);
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleAddRoom = (floorIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms.push({ roomName: "", aisles: [] });
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleRemoveRoom = (floorIndex, roomIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms = newFloors[floorIndex].rooms.filter(
      (_, i) => i !== roomIndex
    );
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleAddAisle = (floorIndex, roomIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms[roomIndex].aisles.push({
      aisleName: "",
      shelves: [],
    });
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleRemoveAisle = (floorIndex, roomIndex, aisleIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms[roomIndex].aisles = newFloors[floorIndex].rooms[
      roomIndex
    ].aisles.filter((_, i) => i !== aisleIndex);
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleAddShelf = (floorIndex, roomIndex, aisleIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms[roomIndex].aisles[aisleIndex].shelves.push({
      shelfName: "",
      bins: [],
    });
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleRemoveShelf = (floorIndex, roomIndex, aisleIndex, shelfIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms[roomIndex].aisles[aisleIndex].shelves =
      newFloors[floorIndex].rooms[roomIndex].aisles[aisleIndex].shelves.filter(
        (_, i) => i !== shelfIndex
      );
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleAddBin = (floorIndex, roomIndex, aisleIndex, shelfIndex) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms[roomIndex].aisles[aisleIndex].shelves[
      shelfIndex
    ].bins.push({ binName: "", binCapacity: 0 });
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleRemoveBin = (
    floorIndex,
    roomIndex,
    aisleIndex,
    shelfIndex,
    binIndex
  ) => {
    const newFloors = [...warehouse.floors];
    newFloors[floorIndex].rooms[roomIndex].aisles[aisleIndex].shelves[
      shelfIndex
    ].bins = newFloors[floorIndex].rooms[roomIndex].aisles[aisleIndex].shelves[
      shelfIndex
    ].bins.filter((_, i) => i !== binIndex);
    setWarehouse({ ...warehouse, floors: newFloors });
  };

  const handleInputChange = (e, path) => {
    const newWarehouse = { ...warehouse };
    let current = newWarehouse;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = e.target.value;
    setWarehouse(newWarehouse);
  };

  const handleSubmit = async () => {
    try {
      const url = warehouseID
        ? `https://localhost:7200/api/warehouse/update/${warehouseID}`
        : "https://localhost:7200/api/warehouse/create";
      const method = warehouseID ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(warehouse),
      });

      if (response.ok) {
        navigate("/warehouses");
        message.success(
          `Warehouse ${warehouseID ? "updated" : "created"} successfully!`
        );
      } else {
        message.error(
          `Failed to ${warehouseID ? "update" : "create"} warehouse.`
        );
      }
    } catch (error) {
      message.error(
        `An error occurred while ${
          warehouseID ? "updating" : "creating"
        } the warehouse.`
      );
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Warehouse Name">
        <Input
          value={warehouse.warehouseName}
          onChange={(e) => handleInputChange(e, ["warehouseName"])}
        />
      </Form.Item>
      <Form.Item label="Warehouse Address">
        <Input
          value={warehouse.warehouseAddress}
          onChange={(e) => handleInputChange(e, ["warehouseAddress"])}
        />
      </Form.Item>
      {warehouse.floors.map((floor, floorIndex) => (
        <Card
          key={floorIndex}
          title={`Floor ${floorIndex + 1}`}
          extra={
            <MinusCircleOutlined
              onClick={() => handleRemoveFloor(floorIndex)}
            />
          }
        >
          <Form.Item label="Floor Name">
            <Input
              value={floor.floorName}
              onChange={(e) =>
                handleInputChange(e, ["floors", floorIndex, "floorName"])
              }
            />
          </Form.Item>
          {floor.rooms.map((room, roomIndex) => (
            <Card
              key={roomIndex}
              title={`Room ${roomIndex + 1}`}
              extra={
                <MinusCircleOutlined
                  onClick={() => handleRemoveRoom(floorIndex, roomIndex)}
                />
              }
            >
              <Form.Item label="Room Name">
                <Input
                  value={room.roomName}
                  onChange={(e) =>
                    handleInputChange(e, [
                      "floors",
                      floorIndex,
                      "rooms",
                      roomIndex,
                      "roomName",
                    ])
                  }
                />
              </Form.Item>
              {room.aisles.map((aisle, aisleIndex) => (
                <Card
                  key={aisleIndex}
                  title={`Aisle ${aisleIndex + 1}`}
                  extra={
                    <MinusCircleOutlined
                      onClick={() =>
                        handleRemoveAisle(floorIndex, roomIndex, aisleIndex)
                      }
                    />
                  }
                >
                  <Form.Item label="Aisle Name">
                    <Input
                      value={aisle.aisleName}
                      onChange={(e) =>
                        handleInputChange(e, [
                          "floors",
                          floorIndex,
                          "rooms",
                          roomIndex,
                          "aisles",
                          aisleIndex,
                          "aisleName",
                        ])
                      }
                    />
                  </Form.Item>
                  {aisle.shelves.map((shelf, shelfIndex) => (
                    <Card
                      key={shelfIndex}
                      title={`Shelf ${shelfIndex + 1}`}
                      extra={
                        <MinusCircleOutlined
                          onClick={() =>
                            handleRemoveShelf(
                              floorIndex,
                              roomIndex,
                              aisleIndex,
                              shelfIndex
                            )
                          }
                        />
                      }
                    >
                      <Form.Item label="Shelf Name">
                        <Input
                          value={shelf.shelfName}
                          onChange={(e) =>
                            handleInputChange(e, [
                              "floors",
                              floorIndex,
                              "rooms",
                              roomIndex,
                              "aisles",
                              aisleIndex,
                              "shelves",
                              shelfIndex,
                              "shelfName",
                            ])
                          }
                        />
                      </Form.Item>
                      {shelf.bins.map((bin, binIndex) => (
                        <Card
                          key={binIndex}
                          title={`Bin ${binIndex + 1}`}
                          extra={
                            <MinusCircleOutlined
                              onClick={() =>
                                handleRemoveBin(
                                  floorIndex,
                                  roomIndex,
                                  aisleIndex,
                                  shelfIndex,
                                  binIndex
                                )
                              }
                            />
                          }
                        >
                          <Form.Item label="Bin Name">
                            <Input
                              value={bin.binName}
                              onChange={(e) =>
                                handleInputChange(e, [
                                  "floors",
                                  floorIndex,
                                  "rooms",
                                  roomIndex,
                                  "aisles",
                                  aisleIndex,
                                  "shelves",
                                  shelfIndex,
                                  "bins",
                                  binIndex,
                                  "binName",
                                ])
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Bin Capacity">
                            <Input
                              type="number"
                              value={bin.binCapacity}
                              onChange={(e) =>
                                handleInputChange(e, [
                                  "floors",
                                  floorIndex,
                                  "rooms",
                                  roomIndex,
                                  "aisles",
                                  aisleIndex,
                                  "shelves",
                                  shelfIndex,
                                  "bins",
                                  binIndex,
                                  "binCapacity",
                                ])
                              }
                            />
                          </Form.Item>
                        </Card>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() =>
                          handleAddBin(
                            floorIndex,
                            roomIndex,
                            aisleIndex,
                            shelfIndex
                          )
                        }
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Bin
                      </Button>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() =>
                      handleAddShelf(floorIndex, roomIndex, aisleIndex)
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Shelf
                  </Button>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => handleAddAisle(floorIndex, roomIndex)}
                block
                icon={<PlusOutlined />}
              >
                Add Aisle
              </Button>
            </Card>
          ))}
          <Button
            type="dashed"
            onClick={() => handleAddRoom(floorIndex)}
            block
            icon={<PlusOutlined />}
          >
            Add Room
          </Button>
        </Card>
      ))}
      <Button
        type="dashed"
        onClick={handleAddFloor}
        block
        icon={<PlusOutlined />}
      >
        Add Floor
      </Button>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {warehouseID ? "Update Warehouse" : "Create Warehouse"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateWarehouse;
