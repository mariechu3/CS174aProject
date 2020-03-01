window.Mirror_Scene= window.classes.Mirror_Scene =
    class Mirror_Scene extends Scene_Component {
        constructor(context, control_box)
        {
            // The scene begins by requesting the camera, shapes, and materials it will need.
            super(context, control_box);
            // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0));
            this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform);

            this.initial_avatar_location = Mat4.identity().times(Mat4.translation([0,0,5]));
            this.avatar_pos = this.initial_avatar_location;

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                torus: new Torus(15, 15),
                torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),

                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                //        (Requirement 1)
                sphere: new Subdivision_Sphere(4),
                box: new Cube_2(),
                mirror: new Mirror(50,50),
                frame: new Frame(50,50),
                spike: new SpikeBall(15,15,[2,2]),
                square: new Square()

            };
            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            this.materials =
                {
                    avatar: context.get_instance(Phong_Shader).material(Color.of(0,0,1,1), {ambient: 0.1}),
                    wall: context.get_instance(Phong_Shader).material(Color.of(.8,.9,1,1), {ambient: 1}),
                    mirror: context.get_instance(Phong_Shader).material(Color.of(.95,1,.95,1), {ambient:0.1, diffusivity: 0}),
                    floor: context.get_instance (Phong_Shader).material( Color.of (0,0,0,1), {ambient: 0.3, texture: context.get_instance("assets/tile.jpg",true)}),
                };

            this.lights = [new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
                           new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)];

            this.move_l_pressed = this.move_r_pressed = this.move_u_pressed =
                this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
        }
        set_pos(dir)
        {
            if(dir==1)
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([-.5,0,0]));
            else if(dir==2)
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([0,.5,0]));
            else if(dir==3) {
                if (this.avatar_pos[1][3] > -4.5)
                    this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, -.5, 0]));
            }
            else if(dir==4) {
                if(this.avatar_pos[2][3]>1.0)
                    this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, -.5]));
            }
            else if(dir==5)
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([0,0,.5]));
            else
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([.5,0,0]));

            this.move_l_pressed = this.move_r_pressed = this.move_u_pressed =
                this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
        }

        make_control_panel() {
            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

            this.key_triggered_button("Move Avatar Left", ["4"], () => {this.move_l_pressed = true});
            this.key_triggered_button("Move Avatar Right", ["5"], () => {this.move_r_pressed = true});
            this.new_line();
            this.key_triggered_button("Move Avatar Up", ["6"], () => {this.move_u_pressed = true});
            this.key_triggered_button("Move Avatar Down", ["7"], () => {this.move_d_pressed = true});
            this.new_line();
            this.key_triggered_button("Move Avatar Forward", ["8"], () => {this.move_f_pressed = true});
            this.key_triggered_button("Move Avatar Back", ["9"], () => {this.move_b_pressed = true});
            this.new_line();
            this.new_line();
            this.new_line();
            this.key_triggered_button("View whole scene", ["0"], () => this.attached = () => this.initial_camera_location);
            this.new_line();
            this.key_triggered_button("Attach to mirror 1", ["1"], () => this.attached = () => this.mirror_1);
            this.key_triggered_button("Attach to mirror 2", ["2"], () => this.attached = () => this.mirror_2);
            this.new_line();
            this.key_triggered_button("Attach to mirror 3", ["3"], () => this.attached = () => this.mirror_3);
            this.key_triggered_button("Attach to avatar 4", ["a"], () => this.attached = () => this.avatar_pos);
            this.new_line();
        }
        setupScene(graphics_state)
        {
            let identity = Mat4.identity();
            this.mirror_1 = identity.times(Mat4.scale([.25,.5,.05]));
            this.shapes.mirror.draw(graphics_state,this.mirror_1,this.materials.mirror);
            this.mirror_2 = identity.times(Mat4.translation([-10,0,0])).times(Mat4.scale([.25,.5,.05]));
            this.shapes.mirror.draw(graphics_state,this.mirror_2,this.materials.mirror);
            this.mirror_3 = identity.times(Mat4.translation([10,0,0])).times(Mat4.scale([.25,.5,.05]));
            this.shapes.mirror.draw(graphics_state,this.mirror_3,this.materials.mirror);
            this.shapes.box.draw(graphics_state,identity.times(Mat4.translation([0,-15,0])).times(Mat4.scale([50,12,50])),this.materials.floor);
            //needs to be fixed for collisions/actually have some way to just have a wall with holes in it
            this.shapes.frame.draw(graphics_state,this.mirror_1.times(Mat4.scale([1.5,1.5,1.5])),this.materials.wall);
            this.shapes.frame.draw(graphics_state,this.mirror_2.times(Mat4.scale([1.5,1.5,1.5])),this.materials.wall);
            this.shapes.frame.draw(graphics_state,this.mirror_3.times(Mat4.scale([1.5,1.5,1.5])),this.materials.wall);
            this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([-5,4,0])).times(Mat4.scale([2.5,10,1])),this.materials.wall);
            this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([5,4,0])).times(Mat4.scale([2.5,10,1])),this.materials.wall);
            this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([-30,4,0])).times(Mat4.scale([17.5,10,1])),this.materials.wall);
            this.shapes.square.draw(graphics_state,identity.times(Mat4.translation([30,4,0])).times(Mat4.scale([17.5,10,1])),this.materials.wall);
            this.shapes.box.draw(graphics_state,identity.times(Mat4.translation([0,34.2,0])).times(Mat4.scale([50,30,.05])),this.materials.wall);

        }
        movement()
        {
            // movement of avatar
            if(this.move_r_pressed)
                this.set_pos(0);
            else if(this.move_l_pressed)
                this.set_pos(1);
            else if(this.move_u_pressed)
                this.set_pos(2);
            else if(this.move_d_pressed)
                this.set_pos(3);
            else if(this.move_f_pressed)
                this.set_pos(4);
            else if(this.move_b_pressed)
                this.set_pos(5);
        }
        mirror_eq(focus,obj_dist)
        {
            return (obj_dist*focus)/(obj_dist-focus);
        }

        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
            let identity = Mat4.identity();
            this.setupScene(graphics_state);
            this.movement();

            //draw avatar
            this.shapes.spike.draw(graphics_state,this.avatar_pos,this.materials.avatar);

            //draw reflected cases
            //plane mirror
            let copy = this.avatar_pos;
            let scale = 1;
            let reflected_mat = [copy[0], copy[1], [-1*copy[2][0],-1*copy[2][1],-1*copy[2][2],-1*copy[2][3]], copy[3]];
            if(this.avatar_pos[0][3]>= -4 && this.avatar_pos[0][3] <= 4)
                this.shapes.spike.draw(graphics_state,reflected_mat,this.materials.avatar);
            //convex case will always be upright
            else if(this.avatar_pos[0][3]<-4) {
                scale = (-1*this.mirror_eq(-3,this.avatar_pos[2][3])/this.avatar_pos[2][3]);
                copy = this.avatar_pos.times(Mat4.scale([scale,scale,scale]));
                reflected_mat = [copy[0], copy[1], [-1*copy[2][0],-1*copy[2][1],-1*copy[2][2],-1*copy[2][3]], copy[3]];
                this.shapes.spike.draw(graphics_state, reflected_mat, this.materials.avatar);
            }
            //concave cases
            else if(this.avatar_pos[0][3]> 4) {
                //if needs to be inverted
                if(this.mirror_eq(3,this.avatar_pos[2][3])>0) {
                    scale = (this.mirror_eq(2, this.avatar_pos[2][3]) / this.avatar_pos[2][3]);
                    console.log(scale);
                    copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
                    reflected_mat = [copy[0],
                        [-1 * copy[1][0], -1 * copy[1][1], -1 * copy[1][2], -1 * copy[1][3]],
                        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
                        copy[3]];
                }
                else
                {
                    scale = (-1 * this.mirror_eq(3, this.avatar_pos[2][3]) / this.avatar_pos[2][3]);
                    copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
                    reflected_mat = [copy[0],
                        copy[1],
                        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
                        copy[3]];
                }
                this.shapes.spike.draw(graphics_state,reflected_mat, this.materials.avatar);
            }



            //camera coordinates
            let translate_back = Mat4.translation(Vec.of(0,0,10));
            if(typeof this.attached !== 'undefined') {
                switch (this.attached()) {
                    case (this.initial_camera_location):
                        graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                        //these don't work, probably because of the scaling
                        /*
                    case (this.mirror_1):
                        graphics_state.camera_transform = Mat4.inverse(this.mirror_1.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                    case (this.mirror_2):
                        graphics_state.camera_transform = Mat4.inverse(this.mirror_2.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                    case (this.mirror_3):
                        graphics_state.camera_transform = Mat4.inverse(this.mirror_3.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                    case (this.avatar):
                        graphics_state.camera_transform = Mat4.inverse(this.avatar_pos.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                         */
                }

            }

        }
    };


window.Dart_Scene= window.classes.Dart_Scene =
    class Dart_Scene extends Scene_Component {
        constructor(context, control_box)
        {
            // The scene begins by requesting the camera, shapes, and materials it will need.
            super(context, control_box);
            // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0));
            this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform);

            this.initial_avatar_location = Mat4.identity().times(Mat4.translation([0,0,5]));
            this.avatar_pos = this.initial_avatar_location;

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                torus: new Torus(15, 15),
                torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),

                cylinder: new Rounded_Capped_Cylinder(15,15,[2,2]),
                sun: new Subdivision_Sphere(4),

            };
            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            this.materials =
                {
                    dart: context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
                };

            this.lights = [new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
                           new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)];

            this.move_l_pressed = this.move_r_pressed = this.move_u_pressed =
                this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
        }
        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

            // Create Cylinder


            let transform = Mat4.identity();

            // const angle = Math.PI / 4;
            // const V = 20;
            // const g = 9.8;

            // let Vx = V * Math.cos(angle);
            // let Vy = V * Math.sin(angle);

            // let X = Vx * t;
            // let Y = Vy * t - g * t*t/2;

            // let cur_angle = Math.atan(Y/X);

            // transform = transform.times(Mat4.translation([X,Y,0]));
            // transform = transform.times(Mat4.translation([-20,0,0]));
            // transform = transform.times(Mat4.rotation(cur_angle, Vec.of(0,0,1))).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));

            // this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart);

            transform = Mat4.identity();

            // transform = transform.times(Mat4.translation([20,0,0]));
            // transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));

            transform = transform.times(Mat4.scale([10,10,1]));

            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart);


        }
    };


