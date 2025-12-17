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
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(function(response) {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        console.log('Список избранных пользователей успешно загружен');
    } else {
        console.log('Ошибка при загрузке списка избранного');
    }
});

moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Баланс успешно пополнен');
            moneyManager.addMoneyForm.reset();
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Конвертация успешно выполнена');
            moneyManager.conversionMoneyForm.reset();
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Перевод успешно выполнен');
            moneyManager.clearForm();
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

favoritesWidget.addUserCallback = function(userData) {
    ApiConnector.addUserToFavorites(userData, function(response) {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.updateUsersList(response.data);
            favoritesWidget.setMessage('Пользователь добавлен в избранное', 'success');
            console.log('Пользователь добавлен в избранное');
        } else {
            favoritesWidget.setMessage(response.error, 'error');
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