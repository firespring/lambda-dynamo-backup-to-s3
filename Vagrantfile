Vagrant.configure("2") do |config|
    # Ubuntu 16.04
    config.vm.box = "ubuntu/xenial64"

    # forward SSH agent
    config.ssh.forward_agent = true

    # networking
    config.vm.hostname = "lambda"
    config.vm.network "private_network", ip: "172.16.10.10"

    # synced folders
    config.vm.synced_folder "./", "/vagrant", disabled: true
    config.vm.synced_folder "./", "/vagrant/app", owner: "ubuntu", group: "ubuntu", mount_options: ["dmode=755,fmode=644"]
    config.vm.synced_folder "./build", "/srv/app/build", owner: "ubuntu", group: "ubuntu", mount_options: ["dmode=755,fmode=644"]
    config.vm.synced_folder "~/.aws", "/home/ubuntu/.aws", owner: "ubuntu", group: "ubuntu", mount_options: ["dmode=755,fmode=644"]

    # Virtualbox customization
    config.vm.provider "virtualbox" do |vb|
        # customize the amount of memory
        vb.memory = "2048"

        # customize NAT
        vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        vb.customize ['modifyvm', :id, '--cableconnected1', 'on']
    end

    # provision using shell
    config.vm.provision "dependencies",
        type: "shell",
        inline: <<-SHELL
	        curl -sL https://deb.nodesource.com/setup_7.x | bash - && apt-get install -y nodejs
	        npm install --global node-lambda
	        apt-get -y install zip
	    SHELL

    config.vm.provision "sync",
        type: "shell",
        run: "always",
	    inline: <<-SHELL
	        mkdir -p /srv/app
	        rsync -a --delete --exclude-from=/vagrant/app/.rsyncignore /vagrant/app/. /srv/app
	        ln -sfn /srv/app app
		SHELL
end
