import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(1),
  },
  errorTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  formContainer: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  formButtonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
}));