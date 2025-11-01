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
  padding: "15px 26px",
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
  marginBottom: "25px",
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

const ChangeEmailModal = (
  {open, onClose, currentEmail, setNewEmail, setEmailChanged }
  ) => {
  const dispatch = useDispatch();
  const [newUserEmail, setNewUserEmail] = useState(currentEmail);
  const {t} = useTranslation("ProfilePage");

  const handleSubmit = async () => {
    if (!newUserEmail || currentEmail == newUserEmail) {
      dispatch(
        showMessage({
            message: `${t("Type_Email_MSG")}`,
            variant: 'warning'
        }));
        return;
    }

    setNewEmail(newUserEmail);
    setEmailChanged(true);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="closeButton" onClick={onClose}>X</div>
      <DialogTitle>
        {t("Change_Email_Title")}
      </DialogTitle>
      <DialogContent>
        <div className="inputContainer">
          <p>{t("Enter_Email")}</p>
          <input type="text" value={newUserEmail} onChange={event => setNewUserEmail(event.target.value)} />
        </div>
      </DialogContent>
      <DialogActions>
        <StyledSaveButton
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          onClick={handleSubmit}>
          {t("Change_Email")}
        </StyledSaveButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ChangeEmailModal;
