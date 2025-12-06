const logoutButton = new LogoutButton();
logoutButton.action = function() {
	ApiConnector.logout(function(response) {
		console.log('ответ сервера при выходе ', response);
		if (response.success) {
			location.reload();
		}
	});
};

ApiConnector.current(function(response) {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

const ratesBoard = new RatesBoard();

function fetchRates() {
	ApiConnector.getStocks(function(response) {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
			console.log('курсы валют успешно обновлены')
		} else {
			console.log('ошибка при получении курсов валют');
		}
	});
}

fetchRates();
setInterval(fetchRates, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function(data) {
	ApiConnector.addMoney(data, function(response) {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(
				true,
				'баланс успешно пополнен'
			);
			moneyManager.addMoneyForm.reset();
		} else {
			moneyManager.setMessage(
				false,
				response.message || 'ошибка при пополнении баланса'
			);
		}
	});
};

moneyManager.conversionMoneyCallback = function(data) {
	ApiConnector.convertMoney(data, function(response) {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(
				true,
				'конвертация успешно выполнена'
			);
			moneyManager.conversionMoneyForm.reset();
		} else {
			moneyManager.setMessage(
				false,
				response.message || 'ошибка при конвертации валюты'
			);
		}
	});
};

moneyManager.sendMoneyCallback = function(data) {
	ApiConnector.transferMoney(data, function(response) {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(
				true,
				'перевод успешно выполнен'
			);
			moneyManager.sendMoneyForm.reset();
		} else {
			moneyManager.setMessage(
				false,
				response.message || 'ошибка при переводе средств'
			);
		}
	});
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(function(response) {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
		console.log('список избранных пользователей успешно загружен');
	} else {
		console.log('ошибка при загрузке списка избранного');
	}
});

favoritesWidget.addUserCallback = function(userData) {
	ApiConnector.addUserToFavorites(userData, function(response) {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data || userData);
			favoritesWidget.updateUsersList(response.data || [userData]);
			favoritesWidget.setMessage("Пользователь успешно добавлен в избранное", 'success');
			console.log('Пользователь успешно добавлен в избранное');
		} else {
			favoritesWidget.setMessage(`Ошибка: ${response.error || "Не удалось добавить пользователя"}`, "error");
			console.log('Ошибка при добавлении пользователя:', response.error);
		}
	});
};

favoritesWidget.removeUserCallback = function(userData) {
	ApiConnector.removeUserFromFavorites(userData, function(response) {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			favoritesWidget.updateUsersList(response.data);
			favoritesWidget.setMessage('пользователь успешно удален из избранного', 'success');
			console.log('пользователь успешно удален из избранного');
		} else {
			favoritesWidget.setMessage(`Ошибка: ${response.error || "Не удалось удалить пользователя"}`, "error");
			console.log('ошибка при удаление пользователя', response.error);
		}
	});
};