import { AppDispatch } from "@/store/store";
import { IconButton, Switch } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectAdmin,
  selectEditor,
  setEditor,
} from "@/store/slice/adminSlice";

const AdminHeader: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const admin = useSelector(selectAdmin);
  const editor = useSelector(selectEditor);

  const handleEditor = () => {
    dispatch(setEditor(!editor));
  };

  return (
    <div className="flex items-center justify-end gap-5">
      {admin ? <Switch checked={editor} onChange={handleEditor} /> : ""}
      {admin ? (
        <IconButton onClick={() => dispatch(logout())} size="medium">
          <LogoutIcon sx={{ color: "black" }} />
        </IconButton>
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminHeader;
