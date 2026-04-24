# Moodify-AI VPS Deployment

Bu kurulum, `moodweave` ile benzer şekilde Docker image build + Docker Compose up yaklaşımını kullanır.

## 1) Sunucuda ilk hazırlık

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
sudo usermod -aG docker $USER
newgrp docker
```

```bash
sudo mkdir -p /opt/moodify-ai
sudo chown -R $USER:$USER /opt/moodify-ai
cd /opt
git clone <YOUR_REPO_URL> moodify-ai
cd moodify-ai
cp .env.example .env
```

`.env` dosyasını production değerleri ile doldurun.

## 2) Docker ağı ve container'ları ayağa kaldırma

```bash
docker network create edge || true
bash scripts/deploy.sh
```

## 3) Host Nginx reverse proxy

`infra/nginx/moodify-ai.conf` içindeki `server_name` değerini domain'inizle değiştirin.

```bash
sudo cp infra/nginx/moodify-ai.conf /etc/nginx/sites-available/moodify-ai.conf
sudo ln -s /etc/nginx/sites-available/moodify-ai.conf /etc/nginx/sites-enabled/moodify-ai.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 4) SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d moodify-ai.mustafaerhanportakal.com
```

Certbot, SSL bloklarını otomatik ekler.

## 5) Sonraki deploy'lar

```bash
cd /opt/moodify-ai
bash scripts/deploy.sh
```

## 6) Opsiyonel CI/CD

`.github/workflows/deploy.yml` dosyası aşağıdaki secret'lar tanımlıysa otomatik deploy eder:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
