"use client";
import { Box, Button, Modal, styled, TextField } from "@mui/material";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";

export default function Home() {
  const [data, setData] = useState({
    title: "",
    description: "",
    price: 0,
    fullDescription: "",
    characteristic: {
      name: "",
      value: "",
    },
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const fetchData = async () => {
    try {
      const response = await fetch("https://site.qpart.com.ua/storage.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Handle error
        console.error("Failed to fetch data");
      } else {
        const result = await response.json();
        console.log("Data fetched successfully", result);
        // Update your state with the fetched data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendData = async () => {
    const response = await fetch("https://site.qpart.com.ua/storage.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    });

    if (!response.ok) {
      // Handle error
      console.error("Failed to send data");
    } else {
      const result = await response.json();
      console.log("Data sent successfully", result);
    }
  };

  return (
    <div>
      <h1>HOME PAGE</h1>
      <div className="absolute top-10 right-10">
        <Button onClick={handleOpen} variant="contained">
          Add Post
        </Button>

        <Button onClick={fetchData} variant="contained">
          GET POST
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="outlined-basic"
            label="Название станка"
            variant="outlined"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <TextField
            id="outlined-basic"
            label="Описание"
            variant="outlined"
            onChange={(e) =>
              setData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <TextField
            id="outlined-basic"
            type="number"
            label="Стоимость"
            variant="outlined"
            onChange={(e) =>
              setData((prev) => ({ ...prev, price: Number(e.target.value) }))
            }
          />
          <TextField
            id="outlined-basic"
            label="Полное описание"
            variant="outlined"
            onChange={(e) =>
              setData((prev) => ({ ...prev, fullDescription: e.target.value }))
            }
          />
          <TextField
            id="outlined-basic"
            label="Имя характеристики"
            variant="outlined"
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                characteristic: {
                  ...prev.characteristic,
                  name: e.target.value,
                },
              }))
            }
          />
          <TextField
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                characteristic: {
                  ...prev.characteristic,
                  name: e.target.value,
                },
              }))
            }
            id="outlined-basic"
            label="Описание характеристики"
            variant="outlined"
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>

          <Button onClick={sendData} variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};
