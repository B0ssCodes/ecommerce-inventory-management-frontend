import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Select, Button, message } from "antd";

const { Option } = Select;

function InventoryToBin() {
  const [warehouses, setWarehouses] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [aisles, setAisles] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [bins, setBins] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAisle, setSelectedAisle] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { inventoryID } = location.state;

  useEffect(() => {
    const fetchWarehouses = async () => {
      const payload = {
        pageNumber: 1,
        pageSize: 1000,
        search: "",
      };
      try {
        const response = await fetch(
          "https://localhost:7200/api/warehouse/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setWarehouses(data.result);
        } else {
          message.error("Failed to fetch warehouses.");
        }
      } catch (error) {
        message.error("An error occurred while fetching warehouses.");
      }
    };
    fetchWarehouses();
  }, []);

  const handleWarehouseChange = async (value) => {
    setSelectedWarehouse(value);
    setFloors([]);
    setRooms([]);
    setAisles([]);
    setShelves([]);
    setBins([]);
    try {
      const response = await fetch(
        `https://localhost:7200/api/warehouse/get/floors/${value}`
      );
      const data = await response.json();
      if (response.ok) {
        setFloors(data.result);
      } else {
        message.error("Failed to fetch floors.");
      }
    } catch (error) {
      message.error("An error occurred while fetching floors.");
    }
  };

  const handleFloorChange = async (value) => {
    setSelectedFloor(value);
    setRooms([]);
    setAisles([]);
    setShelves([]);
    setBins([]);
    try {
      const response = await fetch(
        `https://localhost:7200/api/warehouse/get/rooms/${value}`
      );
      const data = await response.json();
      if (response.ok) {
        setRooms(data.result);
      } else {
        message.error("Failed to fetch rooms.");
      }
    } catch (error) {
      message.error("An error occurred while fetching rooms.");
    }
  };

  const handleRoomChange = async (value) => {
    setSelectedRoom(value);
    setAisles([]);
    setShelves([]);
    setBins([]);
    try {
      const response = await fetch(
        `https://localhost:7200/api/warehouse/get/aisles/${value}`
      );
      const data = await response.json();
      if (response.ok) {
        setAisles(data.result);
      } else {
        message.error("Failed to fetch aisles.");
      }
    } catch (error) {
      message.error("An error occurred while fetching aisles.");
    }
  };

  const handleAisleChange = async (value) => {
    setSelectedAisle(value);
    setShelves([]);
    setBins([]);
    try {
      const response = await fetch(
        `https://localhost:7200/api/warehouse/get/shelves/${value}`
      );
      const data = await response.json();
      if (response.ok) {
        setShelves(data.result);
      } else {
        message.error("Failed to fetch shelves.");
      }
    } catch (error) {
      message.error("An error occurred while fetching shelves.");
    }
  };

  const handleShelfChange = async (value) => {
    setSelectedShelf(value);
    setBins([]);
    try {
      const response = await fetch(
        `https://localhost:7200/api/warehouse/get/bins/${value}`
      );
      const data = await response.json();
      if (response.ok) {
        setBins(data.result);
      } else {
        message.error("Failed to fetch bins.");
      }
    } catch (error) {
      message.error("An error occurred while fetching bins.");
    }
  };

  const handleBinChange = (value) => {
    setSelectedBin(value);
  };

  const handleAddInventoryToBin = async () => {
    try {
      const response = await fetch(
        "https://localhost:7200/api/location/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ binID: selectedBin, inventoryID }),
        }
      );
      if (response.ok) {
        message.success("Inventory added to bin successfully!");
        navigate("/inventories");
      } else {
        message.error("Failed to add inventory to bin.");
      }
    } catch (error) {
      message.error("An error occurred while adding inventory to bin.");
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Select Warehouse">
        <Select onChange={handleWarehouseChange} value={selectedWarehouse}>
          {warehouses.map((warehouse) => (
            <Option key={warehouse.warehouseID} value={warehouse.warehouseID}>
              {warehouse.warehouseName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {selectedWarehouse && (
        <Form.Item label="Select Floor">
          <Select onChange={handleFloorChange} value={selectedFloor}>
            {floors.map((floor) => (
              <Option key={floor.floorID} value={floor.floorID}>
                {floor.floorName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {selectedFloor && (
        <Form.Item label="Select Room">
          <Select onChange={handleRoomChange} value={selectedRoom}>
            {rooms.map((room) => (
              <Option key={room.roomID} value={room.roomID}>
                {room.roomName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {selectedRoom && (
        <Form.Item label="Select Aisle">
          <Select onChange={handleAisleChange} value={selectedAisle}>
            {aisles.map((aisle) => (
              <Option key={aisle.aisleID} value={aisle.aisleID}>
                {aisle.aisleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {selectedAisle && (
        <Form.Item label="Select Shelf">
          <Select onChange={handleShelfChange} value={selectedShelf}>
            {shelves.map((shelf) => (
              <Option key={shelf.shelfID} value={shelf.shelfID}>
                {shelf.shelfName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {selectedShelf && (
        <Form.Item label="Select Bin">
          <Select onChange={handleBinChange} value={selectedBin}>
            {bins.map((bin) => (
              <Option key={bin.binID} value={bin.binID}>
                {bin.binName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {selectedBin && (
        <Form.Item>
          <Button type="primary" onClick={handleAddInventoryToBin}>
            Add Inventory to Bin
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}

export default InventoryToBin;
