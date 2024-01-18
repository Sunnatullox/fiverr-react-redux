import axios from 'axios'
import { API_URL } from '../../utils/constant'

export const handleGetCategorys = async() => {
    const {data} = await axios.get(`${API_URL}/get-categorys`)
    return data
}