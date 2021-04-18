import moment from "moment";
import { deepClone, randomNumber } from "../../utility/commonFunctions";
import {
  ADD_SHIFT,
  GET_WEEK_DAYS,
  TOGGLE_24,
  REMOVE_SHIFT,
  OPEN_DAY,
  SET_SHIFT_TIME_FROM,
  SET_SHIFT_TIME_TO,
  COPY_TIMES_TO_ALL,
  GET_CITY,
  CLEAR_HUB,
  VIEW_HUB,
  GET_COUNTRIES,
  GET_CITIES,
  GET_HUBS,
  CLEAR_HUBS,
  SELECT_HUB,
  GET_HUBS_DDL,
} from "./hubsTypes";
import toasters from "../../utility/toasters";

import { weekDays } from "../../utility/constants";

const INITIAL_STATE = {
  weekDays: [],
  viewedHub: null,
  hubsList: null,
  countriesList: null,
  citiesList: null,
  selectedHub: null,
  cityArr: null,
  formattedAddressLv1: null,
  formattedAddressLv2: null,
  formattedAddressLv3: null,
  formattedAddressLv4: null,
  onDragEvent: false,
  hubsDDL: { data: [], meta: {} },
};

const addInitialShift = (dayId) => ({
  id: randomNumber(),
  day: dayId,
  time_from: null,
  time_to: null,
  errUiId: randomNumber(),
});

const hubsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_WEEK_DAYS: {
      return { ...state, weekDays: action.payload };
    }
    case OPEN_DAY: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day) => {
        if (day.id === action.payload.id) {
          day.open = day.open ? 0 : 1; // backend understands 0 and 1 only
          // clearing shifts in case close the day
          if (!day.open) {
            day.shifts = [addInitialShift(day.id)];
            day.allDay = 0;
          }
        }
      });
      return { ...state, weekDays: updatedWeekDays };
    }
    case TOGGLE_24: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day) => {
        if (day.id === action.payload.id) {
          day.allDay = day.allDay ? 0 : 1;

          // making one shift in array if open 24 hrs
          if (day.allDay) {
            day.shifts = [addInitialShift(day.id)];
          }
        }
      });
      return { ...state, weekDays: updatedWeekDays };
    }
    case ADD_SHIFT: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day) => {
        if (day.id === action.payload.id) {
          // adding max numb of shifts
          if (action.payload.shifts.length > 2) {
            toasters.Error("The Maximum number of shifts is 3.");
            return 0;
          }
          day.shifts.push(addInitialShift(day.id));
        }
      });
      return { ...state, weekDays: updatedWeekDays };
    }
    case REMOVE_SHIFT: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day) => {
        if (day.id === action.payload.id) {
          if (action.payload.shifts.length === 1) {
            return;
          }
          day.shifts.pop();
        }
      });
      return { ...state, weekDays: updatedWeekDays };
    }
    case SET_SHIFT_TIME_FROM: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day) => {
        if (day.id === action.payload.day) {
          // finding the index if the shift
          const shiftIndex = day.shifts.findIndex((shift) => shift.id === action.payload.id);
          // set the value for this specific shift
          day.shifts[shiftIndex].time_from = action.payload.time_from;
        }
      });
      return { ...state, weekDays: updatedWeekDays };
    }
    case SET_SHIFT_TIME_TO: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day) => {
        if (day.id === action.payload.day) {
          // finding the index if the shift
          const shiftIndex = day.shifts.findIndex((shift) => shift.id === action.payload.id);
          // set the value for this specific shift
          day.shifts[shiftIndex].time_to = action.payload.time_to;
          if (
            moment(day.shifts[shiftIndex].time_to, "hh:mm A") <
            moment(day.shifts[shiftIndex].time_from, "hh:mm A")
          ) {
            console.log("ERR => ", `day[${day.id}].shifts[${shiftIndex}].time_from`);
          }
        }
      });
      return { ...state, weekDays: updatedWeekDays };
    }
    case COPY_TIMES_TO_ALL: {
      const updatedWeekDays = state.weekDays;
      updatedWeekDays.forEach((day, i) => {
        day.open = action.payload.open;
        day.allDay = action.payload.allDay;
        day.shifts = deepClone(action.payload.shifts);
        day.shifts.forEach((shift) => {
          shift.day = day.id;
          shift.id = randomNumber();
        });
      });

      return { ...state, weekDays: updatedWeekDays };
    }
    case GET_CITY: {
      return {
        ...state,
        cityArr: action.payload.data,
        formattedAddressLv1: action.payload.data[0].formatted_address,
        formattedAddressLv2: action.payload.data[1].formatted_address,
        formattedAddressLv3: action.payload.data[2].formatted_address,
        formattedAddressLv4: action.payload.data[3].formatted_address,
        onDragEvent: action.payload.onDragEvent,
      };
    }
    case GET_HUBS: {
      return { ...state, hubsList: action.payload };
    }
    case SELECT_HUB: {
      return {
        ...state,
        selectedHub: action.payload,
        selectType: action.selectType,
      };
    }
    case CLEAR_HUB: {
      return { ...INITIAL_STATE };
    }
    case CLEAR_HUBS: {
      return { ...state, hubsList: null };
    }
    case GET_COUNTRIES: {
      return { ...state, countriesList: action.payload };
    }
    case GET_CITIES: {
      return { ...state, citiesList: action.payload };
    }
    case VIEW_HUB: {
      const hubWorkingDays = action.payload.working_hours;
      const WEEK_DAYS = deepClone(weekDays);
      const NEW_WEEK_DAYS = WEEK_DAYS.map((day) => {
        const updatedDay = { ...day };

        const newShifts = hubWorkingDays
          .map((hwd) => {
            if (hwd.day === day.id) {
              return {
                id: randomNumber(),
                day: hwd.day,
                time_from: hwd.time_from,
                time_to: hwd.time_to,
                errUiId: randomNumber(),
              };
            }
            return "";
          })
          .filter((shift) => shift !== "");

        updatedDay.shifts = newShifts.length > 0 ? newShifts : [addInitialShift(updatedDay.id)];

        return updatedDay;
      });
      NEW_WEEK_DAYS.forEach((day) => {
        hubWorkingDays.forEach((hubDay) => {
          if (hubDay.day === day.id) {
            day.allDay = hubDay.all_day;
            day.open = 1;
          }
        });
      });

      return { ...state, viewedHub: action.payload, weekDays: NEW_WEEK_DAYS };
    }
    case GET_HUBS_DDL: {
      const updatedDDL = state.hubsDDL;
      updatedDDL.data = [...updatedDDL.data, ...action.payload.data];
      updatedDDL.meta = action.payload.meta;
      return { ...state, hubsDDL: updatedDDL };
    }
    default: {
      return state;
    }
  }
};

export default hubsReducer;
