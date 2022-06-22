## System Requirements
- Python 3.7+
- Latest LTS version of Node

## Getting Started

Clone this repo `git clone https://github.com/liobrdev/zoomies.git`

Initalizie the database and run the backend code within the `/api` folder:

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
flask init-db
gunicorn 'app:create_app()'
```

In a different terminal or tab, build and run the frontend code within the `/frontend` folder:

```bash
cd frontend
npm install
npm run build
npm run start
```

After running the previous commands, open `http://localhost:3000` in a browser.

## Just For Fun

See the deployed application at [https://zoomies.liobr.dev](https://zoomies.liobr.dev)!
