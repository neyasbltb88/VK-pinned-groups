console.log('%c%s', (window.log_color) ? window.log_color.green : '', `*PinnedGroups* Скрипт вставлен на страницу: ${document.title}`);

var groupsJson = {
    "response": {
        "items": [{
            "name": "๖ۣۜХауди ๖ۣۜХо™ - Просто о мире IT!",
            "screen_name": "howdyho_net",
            "photo_50": "https://pp.userapi.com/c852216/v852216144/3d13c/DuLRvHG4LJw.jpg?ava=1"
        }, {
            "name": "Десигн",
            "screen_name": "designmdk",
            "photo_50": "https:\/\/pp.userapi.com\/c849128\/v849128509\/5fe71\/QCdmYbrh0K8.jpg?ava=1"
        }, {
            "name": "/dev/null",
            "screen_name": "tnull",
            "photo_50": "https://pp.userapi.com/c840632/v840632737/7fa7a/5d-h6o_8VS8.jpg?ava=1"
        }]
    }
}

// ////////////////////////////////////////////

// --- PinnedGroups ---
function definePinnedClasses() {
    console.log('%c%s', (window.log_color) ? window.log_color.purple : '', '*PinnedGroups* Инициализация PinnedGroups');

    // Получим родительское меню, в котором будем создавать контейнер с группами
    let parent = document.querySelector('#side_bar .side_bar_inner ol');

    // Класс для создания пункта с группой по шаблону
    class PinnedItem {
        // Принимает объект с данными конкретной группы в формате ответа api: method=groups.get
        constructor(groupObj) {
            this.name = groupObj.name;
            this.screen_name = groupObj.screen_name;
            this.photo_50 = groupObj.photo_50;
            this.item = null;
            this.template = `
<a href="/${this.screen_name}" target="_blank" class="left_row">
<span class="left_fixer">
  <span class="left_icon fl_l" style="background-image: url('${this.photo_50}')"></span>
  <span class="left_label inl_bl">${this.name}</span>
</span>
</a>`;


            this.init();
        }

        // Метод для получения созданного элемента списка и его имени
        get() {
            return {
                screen_name: this.screen_name,
                item: this.item
            };
        }

        init() {
            // Создать пункт из информации переданной группы
            let li = document.createElement('li');
            li.className = 'l_comm pinned_item';
            li.innerHTML = this.template;
            this.item = li;
        }
    }

    // --- Главный управляющий класс ---
    class PinnedGroups {
        // Принимает родительский элемнт(меню), в котором будет создан список
        constructor(parent) {
            this.parent_el = parent;
            this.container_selector = '.pinned_groups ul';
            this.container = null;
            this.itemsBuffer = {};


            // Точка входа в классе
            this.init();
        }

        getPinnedGroupsArr() {
            // Получаем массив из объектов групп в формате api: method=groups.get
            let arr = groupsJson.response.items;

            // Для каждой группы из массива
            arr.forEach(item => {
                // Создаем экземпляр списка для конкретной группы
                let new_item_instance = new PinnedItem(item);
                // Получаем его элемент
                let new_item_el = new_item_instance.get();

                // Сохраним экземпляр в буфер
                // Это понадобится в дальнейшем для удаления пунктов
                this.itemsBuffer[new_item_el.screen_name] = new_item_el.new_item_instance;

                // Вставляем в контейнер новый пункт
                this.container.appendChild(new_item_el.item);
            });
        }

        createContainerStyle(menu_footer) {
            // Создаем элемент style
            let style = document.createElement('style');
            style.className = 'pinned-groups_style';
            // Заполняем его стилями
            style.textContent = `
          /* Скрытие футера в меню */
          .left_menu_nav_wrap {
              /*display: none;*/
          }

          #side_bar .side_bar_inner ol {
              max-height: 80vh;
              /* Если футер меню скрыт, то использовать высоту 88vh */
              /*max-height: 88vh;*/
              overflow: auto;
              padding-right: 5px;
              padding-left: 5px;
          }


          /* Контейнер для запиненных групп */
          .pinned_groups ul {
              list-style: none;
              padding-left: 8px;
          }


          /* Аватарка запиненной группы */
          #side_bar .pinned_groups .pinned_item .left_icon {
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              height: 24px;
              width: 24px;
              margin: 2px 4px;
              border-radius: 50%;
          }`;

            // Вставим стили в body
            document.body.appendChild(style);
        }

        // Метод для создания контейнера в меню для списка групп
        createContainer(container_selector) {
            let container_wrap = document.createElement('li');
            container_wrap.className = this.container_selector.split(' ')[0].slice(1);
            let container = document.createElement('ul');
            container_wrap.appendChild(container);
            this.parent_el.appendChild(container_wrap);
            return container;
        }

        checkContainer(container_selector) {
            // Пытаемся получить готовый контейнер
            let container = document.querySelector(container_selector);
            if (!container) {
                // Если готового контейнера нет, то создаем его
                container = this.createContainer(container_selector);
            }
            // Сохраняем контейнер
            this.container = container;

            // И создаем стили для него
            this.createContainerStyle();
        }

        init() {
            // Проверить существование контейнера
            this.checkContainer(this.container_selector);

            // Получить список групп, которые нужно добавить в контейнер
            // TODO: этот метод сейчас выполняет основную работу,
            // потом нужно его упростить, создав дополнительные методы для работы
            this.getPinnedGroupsArr();
        }
    }

    window.pinnedGroups = new PinnedGroups(parent);
}
// === PinnedGroups ===



// Не будем запускать скрипт, если у документа нет тайтла.
// Нужно для того, чтобы скрипт повторно не срабатывал из iframe
if (document.title) {
    window.addEventListener('load', function() {
        console.log('%c%s', (window.log_color) ? window.log_color.orange : '', '*PinnedGroups* Событие загрузки страницы');

        // --- PinnedGroups ---
        // Если модуль PinnedGroups еще не инициализировался, сделаем это
        if (!window.pinnedGroups) {
            window.pinnedGroups = true;
            definePinnedClasses();
        }
        // === PinnedGroups ===

    });
}



//                  === ВНИМАНИЕ ====
// Для запуска этого скрипта из консоли, после его вставки, 
// вызовите вручную в консоли функцию definePinnedClasses()

// Для цветной консоли, в консоль нужно вставить содержимое color_log.js