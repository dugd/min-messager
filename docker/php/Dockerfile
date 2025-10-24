FROM php:8.4-fpm

ARG UID=1000
ARG GID=1000

WORKDIR /var/www/html

# PHP extension installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && sync

# Install PHP extensions (safe for Laravel)
RUN install-php-extensions \
    pdo_mysql pdo_pgsql mbstring zip exif pcntl gd bcmath intl sockets redis

# System dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip libpq-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    locales zip jpegoptim optipng pngquant gifsicle libmemcached-dev build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Node.js + Yarn (для фронту збірки assets)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn

# Створюємо користувача
RUN groupmod -o -g ${GID} www-data && usermod -o -u ${UID} -g ${GID} www-data

# Копіюємо лише composer файли для кешування залежностей
COPY ./backend/composer.json ./backend/composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Потім копіюємо увесь код
COPY ./backend ./

# Виправлення прав доступу
RUN chown -R www-data:www-data /var/www/html

USER www-data

CMD ["php-fpm"]
