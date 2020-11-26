const BASE_URL = "http://localhost:3000";
const PATHS = {
  INFO: "/info",
  HELLO: "/hello",
  STORE: "/store",
  PARSE: "/parse",
  LOGIN: "/login",
  PROFILE: "/profile",
};

const axios = require('axios');
axios.defaults.baseURL = BASE_URL;

test("Info endpoint positive test", async () => {
    const response = await axios.get(PATHS.INFO);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual({ author: '23648' });
});

test('Hello endpoint positive test', async() => {
    const name = 'Kacper';
    const response = await axios.get(PATHS.HELLO + '/' + name);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('Hello '+name+'!');
});

test('Hello endpoint positive test - empty chars in the end', async() => {
    const name = 'Kacper  ';
    try {
         await axios.get(PATHS.HELLO + '/' + name);
    }catch({response}){
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('Hello '+name+'!');
    }
});

test("Hello endpoint negative test - too long", async () => {
    const name = 'Kacperaaaaaaaaaaa';
    try {
        await axios.get(PATHS.HELLO + '/' + name);
    } catch ({ response }) {
        expect(response.status).toEqual(400);
        expect(response.data).toEqual('Status 400 - Niepoprawne dane!');
    }
});

test("Hello endpoint negative test - numbers used in name", async () => {
    const name = 'Kacper1';
    try {
        await axios.get(PATHS.HELLO + '/' + name);
    } catch ({ response }) {
        expect(response.status).toEqual(400);
        expect(response.data).toEqual('Status 400 - Niepoprawne dane!');
    }
});

test("Hello endpoint negative test - Polish letters used in name", async () => {
    const name = 'Kacperśźć';
    try {
        await axios.get(PATHS.HELLO + '/' + name);
    } catch ({ response }) {
        expect(response.status).toEqual(400);
        expect(response.data).toEqual('Status 400 - Niepoprawne dane!');
    }
});

test("Store endpoint positive test - first request", async () => {
  const qs = require("qs");
  const data = qs.stringify({ input: "testowa wartość" });
  const response = await axios.post(PATHS.STORE, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  expect(response.status).toEqual(201);
  expect(response.data).toEqual({ 'Stored data': ["testowa wartość"] });
});

test("Store endpoint positive test - second request", async () => {
    const qs = require("qs");
    const data = qs.stringify({ input: "testowa wartość 2" });
    const response = await axios.post(PATHS.STORE, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  
    expect(response.status).toEqual(201);
    expect(response.data).toEqual({ 'Stored data': ["testowa wartość","testowa wartość 2"] });
});

test("Parse endpoint positive test", async() =>{
    const parsers = require("./parsers");
    const data = "value_A:1;value_B:2;value_C:value_D:3,value_E:4;value_F:5;value_G:value_H:6\n";
    const result = parsers.parse(data);
    expect(result).toEqual({
        value_A: 1,
        value_B: 2,
        value_C: {
            value_D: 3,
            value_E: 4
        },
        value_F: 5,
        value_G: {
            value_H: 6
        }
    });
});

test("Login endpoint positive test", async() =>{
    const loginData = require('./consts');
    const data = JSON.stringify({"login":loginData.LOGIN,"password":loginData.PASSWORD});
    const response = await axios.get(PATHS.LOGIN, {
        headers: {
            "Content-Type": "application/json",
          }, 
        data: data
    });
    console.log(response.data);
    expect(response.status).toEqual(200);
    expect(response.data).not.toEqual(null);
    // try {
    //     await axios.get(PATHS.LOGIN, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //               }, 
    //             data: data
    //         });
    // } catch ({response}) {
    //     console.log(response);
    // }
});