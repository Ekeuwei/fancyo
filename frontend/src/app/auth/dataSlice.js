import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching data
export const fetchData = createAsyncThunk('data/fetchData', async ({ url, key }) => {
  const options = {
      headers: {
        // 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    }
  try {
    const response = await axios.get(url, options);
    return { data: response.data, key };
  } catch (error) {
    // Handle errors
    console.error(error.message)
    throw error;
  }
});

// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state, action) => {
        state[action.meta.arg.key] = { status: 'loading' };
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state[action.payload.key] = { status: 'succeeded', data: action.payload.data };
      })
      .addCase(fetchData.rejected, (state, action) => {
        state[action.meta.arg.key] = { status: 'failed', error: action.error.message };
      });
  },
});

export default dataSlice.reducer;
