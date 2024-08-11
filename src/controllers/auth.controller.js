import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { createAccessToken } from "../libs/jwt.js";

// Controlador para el login de usuarios
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "The email does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "The password is incorrect",
      });
    }

    const token = await createAccessToken({
      id: user._id,
      email: user.email,
    });

    res.cookie("user", token, {
      httpOnly: true, 
      secure: false,
      sameSite: 'Lax',
    });

    res.json({
      id: user._id,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controlador para el registro de usuarios
export const register = async (req, res) => {
  try {
    const { email, password, birthday } = req.body;

    const userFound = await userModel.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        message: "The email is already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email,
      password: passwordHash,
      birthday,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({
      id: userSaved._id,
    });

    res.cookie("user", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener el panel del usuario
export const panel = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.json({
      id: user.id,
      email: user.email,
      birthday: formatDate(user.birthday),
      age: calculateAge(user.birthday),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función para calcular la edad a partir de la fecha de nacimiento
const calculateAge = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Función para formatear la fecha a dd/MM/yyyy
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
