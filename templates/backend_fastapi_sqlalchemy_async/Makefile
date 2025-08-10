# Simple Makefile for backend project tasks

PY ?= python
POETRY ?= poetry
ALembicCfg = alembic.ini

.PHONY: install format lint test migrations create-migration upgrade downgrade

install:
	$(PY) -m pip install -r requirements.txt

format:
	ruff check --fix . || true
	ruff format .

lint:
	ruff check .

test:
	pytest -q

migrations:
	alembic upgrade head

create-migration:
	@if [ -z "$(name)" ]; then echo "Usage: make create-migration name=add_feature_table"; exit 1; fi
	alembic revision --autogenerate -m "$(name)"

upgrade:
	alembic upgrade head

downgrade:
	@if [ -z "$(rev)" ]; then echo "Usage: make downgrade rev=<revision_id>"; exit 1; fi
	alembic downgrade $(rev)
