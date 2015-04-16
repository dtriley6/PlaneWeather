Rails.application.routes.draw do

  match '/resolve/:location', to: 'location#resolve', via: 'get', constraints: { location: /[^\/^json]+/ }

  match '/forecast/:origin/:destination/:departure/:speed/:interval', to: 'forecast#calculate',
    via: 'get', constraints: { origin: /[^\/^json]+/, destination: /[^\/^json]+/, departure: /.*/ }
   

  root 'dashboard#home'
end
