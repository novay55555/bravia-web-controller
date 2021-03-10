version=1.0
image=bravia-web-controller:${version}

build:
	npm install && npm run build

debug:
	npm install && npm run serve

docker-build:
	docker build -t ${image} .

docker-push: docker-build
	docker push ${image}

serve: docker-build
	docker run --name bravia-web-controller -p 80:80 -d ${image}