/* eslint-disable jest/unbound-method */
import axios from "axios";
import _ from "lodash";

export const get = _.memoize(axios.get);
