import { gameService } from './model/game-service.js';

// Startseite
const startPage = document.querySelector('#start-page');
const rankingElement = document.querySelector('#ranking');
const startForm = document.querySelector('#start-form');
const nameInput = document.querySelector('#name');

// Spielseite
const gamePage = document.querySelector('#game-page');
const playerNameElement = document.querySelector('#player-name');
const handButtons = document.querySelectorAll('[data-hand]');
const playerHandElement = document.querySelector('#player-hand');
const systemHandElement = document.querySelector('#system-hand');
const resultElement = document.querySelector('#result');
const historyElement = document.querySelector('#history');
const backButton = document.querySelector('#back-button');
