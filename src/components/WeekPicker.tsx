import React, { useState } from "react";
import {
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { getStartOfWeek } from "../helper/function/getStartOfWeek";
import { getEndOfWeek } from "../helper/function/getEndOfWeek";

interface WeekPickerProps {
  onDateChange: (date: Date) => void;
  date: Date;
  color: string;
}

const useStyles = makeStyles((theme) => ({
  arrowButton: {
    border: `1px solid`,
    padding: "4px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.15)",
    },
  },
}));

const WeekPicker: React.FunctionComponent<WeekPickerProps> = ({
  onDateChange,
  date,
  color
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));

  const [currentDate, setCurrentDate] = useState<Date>(date);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const handlePreviousWeek = (): void => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7);
      onDateChange(newDate);
      return newDate;
    });
  };

  const handleNextWeek = (): void => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7);
      onDateChange(newDate);
      return newDate;
    });
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const endOfWeek = getEndOfWeek(startOfWeek);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      spacing={4}
      direction="row"
    >
      <Grid item xs={3} sm="auto">
        <IconButton
          aria-label="Previous Week"
          onClick={handlePreviousWeek}
          className={classes.arrowButton}
        >
          <ChevronLeft />
        </IconButton>
      </Grid>
      <Grid item xs={6} sm="auto">
        <Typography variant={matchesXs ? "subtitle2" : "h6"} align="center" style={{ color }}>
          {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
        </Typography>
      </Grid>
      <Grid item xs={3} sm="auto">
        <IconButton
          aria-label="Next Week"
          onClick={handleNextWeek}
          className={classes.arrowButton}
        >
          <ChevronRight />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default WeekPicker;
