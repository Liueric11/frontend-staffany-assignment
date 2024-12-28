import React, { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import {
  deleteShiftById,
  getShiftsByStartDate,
  publishWeek,
} from "../helper/api/shift";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import WeekPicker from "../components/WeekPicker";
import { formatDate } from "../helper/function/formatDate";
import { formatPublishDate } from "../helper/function/formatPublishDate";
import { CheckCircleOutline } from "@material-ui/icons";
import { useAppContext } from "../AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  addBtn: {
    color: theme.color.turquoise,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  publishBtn: {
    backgroundColor: theme.color.red,
    color: "white",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

interface WeekData {
  startDate: string;
  endDate: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface ActionButtonProps {
  id: string;
  onDelete: () => void;
  disabled: boolean;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
  disabled,
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="edit"
        component={RouterLink}
        disabled={disabled}
        to={`/shift/${id}/edit`}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" onClick={() => onDelete()} disabled={disabled}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const Shift = () => {
  const classes = useStyles();
  const { startOfWeek, setStartOfWeek } = useAppContext();

  const [rows, setRows] = useState([]);
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);
  const [publishLoading, setPublishLoading] = useState<boolean>(false);

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const onPublishClick = () => {
    setShowPublishConfirm(true);
  };

  const onClosePublishDialog = () => {
    setShowPublishConfirm(false);
  };

  const getData = async (startOfWeek: Date) => {
    try {
      setIsLoading(true);
      setErrMsg("");
      const { results } = await getShiftsByStartDate(formatDate(startOfWeek));
      if (results && results.length > 0) {
        setWeekData(results[0].week);
      }else{
        setWeekData(null);
      }
      setRows(results);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData(startOfWeek);
  }, [startOfWeek]);

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} disabled={(weekData?.isPublished === true)}/>
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  const onPublishWeek = async () => {
    try {
      setPublishLoading(true);
      setErrMsg("");

      await publishWeek(formatDate(startOfWeek));
      getData(startOfWeek);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setPublishLoading(false);
      onClosePublishDialog();
    }
  };

  const handleDateChange = (newDate: Date) => {
    setStartOfWeek(newDate);
  };

  let disabledPublishButton = rows.length === 0 || (weekData?.isPublished === true);
  let disabledAddButton = (weekData?.isPublished === true);
  let dateColor = weekData?.isPublished ? "gray" : "black"

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Card className={classes.root}>
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <WeekPicker onDateChange={handleDateChange} date={startOfWeek} color={dateColor}/>
              </Grid>
              <Grid item>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  alignItems="center"
                  direction="row"
                  wrap="nowrap"
                >
                  {weekData != null && weekData.isPublished ? (
                    <Grid item>
                      <Typography variant="body2" color="textSecondary">
                        <CheckCircleOutline fontSize="inherit" style={{ verticalAlign: 'middle', marginRight: 4, marginBottom: 3 }} />
                        Week Published on{" "}
                        {formatPublishDate(weekData.publishedAt)}
                      </Typography>
                    </Grid>
                  ) : null}

                  <Grid item>
                    <Button
                      className={classes.addBtn}
                      variant="outlined"
                      component={RouterLink}
                      to="/shift/add"
                      disabled={disabledAddButton}
                    >
                      ADD SHIFT
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className={classes.publishBtn}
                      variant="contained"
                      onClick={onPublishClick}
                      disabled={disabledPublishButton}
                    >
                      PUBLISH
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <DataTable
              noHeader
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
      <ConfirmDialog
        title="Publish Confirmation"
        description={`Do you want to publish this week ?`}
        onClose={onClosePublishDialog}
        open={showPublishConfirm}
        onYes={onPublishWeek}
        loading={publishLoading}
      />
    </Grid>
  );
};

export default Shift;
