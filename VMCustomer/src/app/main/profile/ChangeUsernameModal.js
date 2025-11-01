import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { showMessage } from 'app/store/fuse/messageSlice';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 30%; /* Default width for desktop */
    background: #e2f9ff;
  }

  @media (max-width: 600px) {
    .MuiDialog-paper {
      width: 80%; /* Width for mobile devices */
    }
  }

  .MuiDialogTitle-root {
    display: flex;
    justify-content: flex-start;
    margin-top: 24px;
    font-family: "Inter var";
    font-size: 22px;
  }

  .closeButton {
    position: absolute;
    font-size: 25px;
    font-style: bold;
    top: 5px;
    right: 16px;
    margin: 0;
    cursor: pointer;
  }

  .MuiDialogContent-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .MuiDialogActions-root {
    display: flex;
    justify-content: center;
  }

  .inputContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    font-size: 18px;
    font-family: "Museo Sans";
    gap: 8px;

    input {
      width: 100%;
      height: 30px;
    }
  }
`;

const StyledSaveButton = styled(motion.button)(({ theme }) => ({
  display: "flex",
  padding: "15px 11px",
  justifyContent: "center",
  alignItems: "center",
  width: "85%",
  height: "42px",
  gap: "10px",
  borderRadius: "15px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "-1.44px",
  marginBottom: "20px",
  cursor: "pointer",
}));

const hoverAnimation = {
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
  backgroundColor: "#536A71",
  borderColor: "#536A71",
  transition: { duration: 0.2 }
};

const tapAnimation = {
  scale: 1.05
};

const ChangeUsernameModal = (
  {open, onClose, currentName, setNewName, setUsernameChanged }
  ) => {
  const dispatch = useDispatch();
  const [newUserName, setNewUserName] = useState(currentName);
  const {t} = useTranslation("ProfilePage");

  const handleSubmit = async () => {
    if (!newUserName || currentName == newUserName) {
      dispatch(
        showMessage({
            message: `${t("Type_New_Name")}`,
            variant: 'warning'
        }));
        return;
    }

    setNewName(newUserName);
    setUsernameChanged(true);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="closeButton" onClick={onClose}>X</div>
      <DialogTitle>
        {t("Change_Name_Title")}
      </DialogTitle>
      <DialogContent>
        <div className="inputContainer">
          <p>{t("Enter_Name")}</p>
          <input type="text" value={newUserName} onChange={event => setNewUserName(event.target.value)} />
        </div>
      </DialogContent>
      <DialogActions>
        <StyledSaveButton
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          onClick={handleSubmit}>
          {t("Change_Name")}
        </StyledSaveButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ChangeUsernameModal;
