import * as React from "react";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  boxShadow: 24,
  p: 4,
};

type WrappedModalProps = {
  title: string;
  content: React.ReactNode;
  trigger: (open: () => void) => React.ReactNode; // The component (e.g., button) that opens the modal
};

export default function WrappedModal({
  title,
  content,
  trigger,
}: WrappedModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {trigger(handleOpen)}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-company rounded-lg">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="font-roboto-mono text-xl font-bold"
          >
            {title}
          </Typography>
          {content}
        </Box>
      </Modal>
    </div>
  );
}
