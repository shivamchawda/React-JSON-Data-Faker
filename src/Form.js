import { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Chip,
  MenuItem,
  Button,
} from "@material-ui/core";
import { options, dataTemplate } from "./data/options";
import { makeStyles } from "@material-ui/core/styles";
import faker from "faker";
import download from "downloadjs";

const categories = Object.keys(options);
// console.log(categories);

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const Form = () => {
  const classes = useStyles();
  const [data, setData] = useState(dataTemplate);
  const [numberOfData, setNumberOfData] = useState(1);

  const handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    let copyData = { ...data };
    copyData[event.target.name] = {};
    event.target.value.forEach((item) => {
      copyData[event.target.name][item] = "";
    });
    setData(copyData);
  };

  const generateData = () => {
    let copyData = JSON.parse(JSON.stringify(options));
    let arrData = [];
    for (let i = 0; i < numberOfData; i++) {
      for (let category of categories) {
        for (let key of Object.keys(options[category])) {
          if (data[category][key] != undefined) {
            copyData[category][key] = faker[category][key]();
          }
        }
      }
      arrData.push(copyData);
      copyData = JSON.parse(JSON.stringify(options));
    }

    download(JSON.stringify(arrData), "fake_data.json", "json");
    setNumberOfData(1);
    setData(dataTemplate);
  };
  return (
    <>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item sm={3} key={category}>
            <Paper component={Box} p={3}>
              <FormControl className={classes.formControl}>
                <InputLabel>{category}</InputLabel>
                <Select
                  name={category}
                  fullWidth
                  multiple
                  value={Object.keys(data[category])}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                >
                  {Object.keys(options[category]).map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper component={Box} my={1} p={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="enter the number of fake data"
          placeholder="Enter the number"
          value={numberOfData}
          onChange={(e) => setNumberOfData(e.target.value)}
        />
      </Paper>
      <Button variant="contained" color="secondary" onClick={generateData}>
        Generate Data
      </Button>
    </>
  );
};

export default Form;
