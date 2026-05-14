if ($(window).width() > 992) {
    /* ANIMATIONS */

    /* ANIMATION FOR 4 BLOCKS FROM CENTER TO EDGES */

    const grid = document.querySelector(".js-animated-grid");
    const items = document.querySelectorAll(".leading-items__item");

    window.addEventListener("scroll", () => {
        const rect = grid.getBoundingClientRect();
        const vh = window.innerHeight;

        // прогресс от 0 до 1
        let progress = (vh - rect.top) / vh;

        progress = 1 - Math.pow(1 - progress, 5);

        const offset = 100;

        items[0].style.transform = `translate(${offset * (1 - progress)}px, ${offset * (1 - progress)
            }px)`;
        items[1].style.transform = `translate(${-offset * (1 - progress)}px, ${offset * (1 - progress)
            }px)`;
        items[2].style.transform = `translate(${offset * (1 - progress)}px, ${-offset * (1 - progress)
            }px)`;
        items[3].style.transform = `translate(${-offset * (1 - progress)}px, ${-offset * (1 - progress)
            }px)`;
    });

    /* ANIMATION FOR ALL UP ITEMS */

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const delay = parseFloat(el.dataset.delay) || 0;

                el.style.transition = `
      opacity 0.6s ease ${delay}s,
      transform 0.8s cubic-bezier(.22,.61,.36,1) ${delay}s
    `;

                el.classList.add("is-visible");
                obs.unobserve(el);
            });
        },
        {
            threshold: 0.25,
        }
    );

    document
        .querySelectorAll(
            `
  .js-common-up,
  .js-common-down,
  .js-common-left,
  .js-common-right
`
        )
        .forEach((el) => {
            observer.observe(el);
        });

    /* ANIMATION FOR CARDS UP */

    document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(".complex-items__container");
        if (!container) return;

        const items = document.querySelectorAll(".complex-blocks__item");

        function update() {
            const rect = container.getBoundingClientRect();
            const vh = window.innerHeight;
            const containerHeight = rect.height;

            // Начало анимации: верх контейнера виден на 1/5 высоты
            const start = vh - containerHeight / 9;
            const end = vh / 4;

            // базовый прогресс 0..1
            let baseProgress = (start - rect.top) / (start - end);
            baseProgress = Math.min(Math.max(baseProgress, 0), 1);

            const offsetStep = -85; // шаг смещения для каждого блока

            items.forEach((item, index) => {
                if (index === 0) {
                    item.style.transform = "translateY(0)";
                    return;
                }

                // каждый блок стартует на offsetStep * index
                const startOffset = offsetStep * index;

                // задержка появления блока
                const delay = index * 0.15;
                let progress = (baseProgress - delay) / (1 - delay);
                progress = Math.min(Math.max(progress, 0), 1);

                // плавное смещение: когда scroll вверх → складывается
                const currentY = startOffset * (1 - progress);
                item.style.transform = `translateY(${currentY}%)`;
            });
        }

        window.addEventListener("scroll", update);
        update();
    });

    /* SCALE IMAGE */

    document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(".js-img-scale");
        if (!container) return;

        const img = container.querySelector("img");
        if (!img) return;

        function updateScale() {
            const rect = container.getBoundingClientRect();
            const vh = window.innerHeight;

            // центр блока
            const blockCenter = rect.top + rect.height / 2;
            const viewportCenter = vh / 2;

            // расстояние от центра блока до центра viewport
            let distance = blockCenter - viewportCenter;

            // зона срабатывания: ±30% от высоты viewport
            const range = vh * 1;

            // нормализуем прогресс: 0 = в центре зоны, 1 = вне зоны
            let progress = Math.abs(distance) / range;
            progress = Math.min(Math.max(progress, 0), 1);

            // масштаб: в центре = 1, сверху/снизу = 1.1
            const scale = 1 + 0.1 * progress;

            img.style.transform = `scale(${scale})`;
            img.style.transition = "transform 0.2s ease-out";
        }

        window.addEventListener("scroll", updateScale);
        updateScale();
    });

    /* ANIMATON */

    document.addEventListener("DOMContentLoaded", () => {
        const columns = document.querySelectorAll(".grid-services__column");
        if (!columns.length) return;

        function updateColumns() {
            const vh = window.innerHeight;
            const activationOffset = vh * 0.5; // зона начала анимации чуть ниже центра

            columns.forEach((col, index) => {
                const rect = col.getBoundingClientRect();
                const distanceFromTrigger = rect.top - (vh / 15 + activationOffset);

                let progress = 0;

                if (distanceFromTrigger < 0) {
                    // прогресс 0 → 1 когда колонка выше точки триггера
                    progress = Math.min(Math.abs(distanceFromTrigger) / (vh * 2), 1);
                }

                // Смещения для первой и третьей колонки, центральная остаётся на месте
                const offsets = [-5, 0, -10]; // в rem: первая, вторая, третья
                const offset = offsets[index] || 0;

                col.style.transform = `translate3d(0, ${offset * progress}rem, 0)`;
                col.style.transition = "transform 0.3s ease-out";
            });
        }

        window.addEventListener("scroll", updateColumns);
        updateColumns();
    });
}
