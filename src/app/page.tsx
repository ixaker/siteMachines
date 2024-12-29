"use client";
import { Box, Button, Modal, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addMachine, fetchMachine } from "@/store/slice/dataSlice";
import { DataItem } from "@/types/types";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<DataItem, 'id'>>({
    title: '',
    description: ''
  })

  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.data.data);

  useEffect(() => {
    dispatch(fetchMachine());
  },[dispatch]);

  console.log("data", data);
  

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



  const handleSubmit = () => {
      dispatch(addMachine(formData));
      setFormData({ title: '', description: ""});
  };


  return (
    <div>
      <h1>HOME PAGE</h1>
      <div className="absolute top-10 right-10">
        <Button onClick={handleOpen} variant="contained">
          Add Post
        </Button>

        <Button variant="contained">
          GET POST
        </Button>
      </div>

      <div>
        {data.map((item, index) => (
          <div key={index}>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
        ))}
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
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <TextField
            id="outlined-basic"
            label="Описание"
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
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

          <Button onClick={handleSubmit} variant="contained" endIcon={<SendIcon />}>
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
