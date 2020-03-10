window.Mirror_Scene = window.classes.Mirror_Scene = class Mirror_Scene extends Scene_Component {
  constructor(context, control_box) {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box);
    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(
        new Movement_Controls(context, control_box.parentElement.insertCell())
      );

    context.globals.graphics_state.camera_transform = Mat4.look_at(
      Vec.of(0, 5, 30),
      Vec.of(0, 0, 0),
      Vec.of(0, 1, 0)
    );
    this.initial_camera_location = Mat4.inverse(
      context.globals.graphics_state.camera_transform
    );

    this.initial_avatar_location = Mat4.identity().times(
      Mat4.translation([0, 0, 5])
    );
    this.avatar_pos = this.initial_avatar_location;

    const r = context.width / context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective(
      Math.PI / 4,
      r,
      0.1,
      1000
    );

    const shapes = {
      // TODO:  Added in as many shapes as we need for this project
      torus: new Torus(15, 15),
      torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),
      sphere: new Subdivision_Sphere(4),
      box: new Cube_2(),
      mirror: new Mirror(50, 50),
      frame: new Frame(50, 50),
      spike: new SpikeBall(15, 15, [2, 2]),
      square: new Square()
    };
    this.submit_shapes(context, shapes);

    // Make some Material objects available to you:
    this.materials = {
      avatar: context
        .get_instance(Phong_Shader)
        .material(Color.of(0, 0, 1, 1), { ambient: 0.1 }),
      wall: context
        .get_instance(Phong_Shader)
        .material(Color.of(0.8, 0.9, 1, 1), { ambient: 1 }),
      mirror: context
        .get_instance(Phong_Shader)
        .material(Color.of(0.95, 1, 0.95, 1), { ambient: 0.1, diffusivity: 0 }),
      floor: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
        ambient: 0.3,
        texture: context.get_instance("assets/tile.jpg", true)
      })
    };

    this.lights = [
      new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(25, 0, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)
    ];

    this.move_l_pressed = this.move_r_pressed = this.move_u_pressed = this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
  }
  set_pos(dir) {
    if (dir === 1)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([-0.5, 0, 0]));
    else if (dir === 2)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0.5, 0]));
    else if (dir === 3) {
      if (this.avatar_pos[1][3] > -4.5)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, -0.5, 0]));
    } else if (dir === 4) {
      if (this.avatar_pos[2][3] > 1.0)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, -0.5]));
    } else if (dir === 5)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, 0.5]));
    else this.avatar_pos = this.avatar_pos.times(Mat4.translation([0.5, 0, 0]));

    this.move_l_pressed = this.move_r_pressed = this.move_u_pressed = this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
  }

  make_control_panel() {
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

    this.key_triggered_button("Move Avatar Left", ["4"], () => {
      this.move_l_pressed = true;
    });
    this.key_triggered_button("Move Avatar Right", ["5"], () => {
      this.move_r_pressed = true;
    });
    this.new_line();
    this.key_triggered_button("Move Avatar Up", ["6"], () => {
      this.move_u_pressed = true;
    });
    this.key_triggered_button("Move Avatar Down", ["7"], () => {
      this.move_d_pressed = true;
    });
    this.new_line();
    this.key_triggered_button("Move Avatar Forward", ["8"], () => {
      this.move_f_pressed = true;
    });
    this.key_triggered_button("Move Avatar Back", ["9"], () => {
      this.move_b_pressed = true;
    });
    this.new_line();
    this.new_line();
    this.new_line();
    this.key_triggered_button(
      "View whole scene",
      ["0"],
      () => (this.attached = () => this.initial_camera_location)
    );
    this.new_line();
    this.key_triggered_button(
      "Attach to mirror 1",
      ["1"],
      () => (this.attached = () => this.mirror_1)
    );
    this.key_triggered_button(
      "Attach to mirror 2",
      ["2"],
      () => (this.attached = () => this.mirror_2)
    );
    this.new_line();
    this.key_triggered_button(
      "Attach to mirror 3",
      ["3"],
      () => (this.attached = () => this.mirror_3)
    );
    this.key_triggered_button(
      "Attach to avatar 4",
      ["a"],
      () => (this.attached = () => this.avatar_pos)
    );
    this.new_line();
  }

  draw_middle_mirror_and_frame(graphics_state) {
    this.mirror_1 = Mat4.identity();
    const mirror_model = this.mirror_1.times(Mat4.scale([0.25, 0.5, 0.05]));
    const frame_model = mirror_model.times(Mat4.scale([1.5, 1.5, 1.5]));
    this.shapes.mirror.draw(
      graphics_state,
      mirror_model,
      this.materials.mirror
    );
    // TODO: [WALL_WITH_HOLES] needs to be fixed for collisions/actually have some way to just have a wall with holes in it
    this.shapes.frame.draw(graphics_state, frame_model, this.materials.wall);
  }

  draw_left_mirror_and_frame(graphics_state) {
    this.mirror_2 = Mat4.identity().times(Mat4.translation([-10, 0, 0]));
    const mirror_model = this.mirror_2.times(Mat4.scale([0.25, 0.5, 0.05]));
    const frame_model = mirror_model.times(Mat4.scale([1.5, 1.5, 1.5]));
    this.shapes.mirror.draw(
      graphics_state,
      mirror_model,
      this.materials.mirror
    );
    // TODO: [WALL_WITH_HOLES] needs to be fixed for collisions/actually have some way to just have a wall with holes in it
    this.shapes.frame.draw(graphics_state, frame_model, this.materials.wall);
  }

  draw_right_mirror_and_frame(graphics_state) {
    this.mirror_3 = Mat4.identity().times(Mat4.translation([10, 0, 0]));
    const mirror_model = this.mirror_3.times(Mat4.scale([0.25, 0.5, 0.05]));
    const frame_model = mirror_model.times(Mat4.scale([1.5, 1.5, 1.5]));
    this.shapes.mirror.draw(
      graphics_state,
      mirror_model,
      this.materials.mirror
    );
    // TODO: [WALL_WITH_HOLES] needs to be fixed for collisions/actually have some way to just have a wall with holes in it
    this.shapes.frame.draw(graphics_state, frame_model, this.materials.wall);
  }

  setupScene(graphics_state) {
    let identity = Mat4.identity();
    this.draw_middle_mirror_and_frame(graphics_state);
    this.draw_left_mirror_and_frame(graphics_state);
    this.draw_right_mirror_and_frame(graphics_state);

    this.shapes.box.draw(
      graphics_state,
      identity
        .times(Mat4.translation([0, -15, 0]))
        .times(Mat4.scale([50, 12, 50])),
      this.materials.floor
    );
    this.shapes.square.draw(
      graphics_state,
      identity
        .times(Mat4.translation([-5, 4, 0]))
        .times(Mat4.scale([2.5, 10, 1])),
      this.materials.wall
    );
    this.shapes.square.draw(
      graphics_state,
      identity
        .times(Mat4.translation([5, 4, 0]))
        .times(Mat4.scale([2.5, 10, 1])),
      this.materials.wall
    );
    this.shapes.square.draw(
      graphics_state,
      identity
        .times(Mat4.translation([-30, 4, 0]))
        .times(Mat4.scale([17.5, 10, 1])),
      this.materials.wall
    );
    this.shapes.square.draw(
      graphics_state,
      identity
        .times(Mat4.translation([30, 4, 0]))
        .times(Mat4.scale([17.5, 10, 1])),
      this.materials.wall
    );
    this.shapes.box.draw(
      graphics_state,
      identity
        .times(Mat4.translation([0, 34.2, 0]))
        .times(Mat4.scale([50, 30, 0.05])),
      this.materials.wall
    );
  }
  movement() {
    // movement of avatar
    if (this.move_r_pressed) this.set_pos(0);
    else if (this.move_l_pressed) this.set_pos(1);
    else if (this.move_u_pressed) this.set_pos(2);
    else if (this.move_d_pressed) this.set_pos(3);
    else if (this.move_f_pressed) this.set_pos(4);
    else if (this.move_b_pressed) this.set_pos(5);
  }
  mirror_eq(focus, obj_dist) {
    return (obj_dist * focus) / (obj_dist - focus);
  }

  display(graphics_state) {
    graphics_state.lights = this.lights; // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000,
      dt = graphics_state.animation_delta_time / 1000;
    let identity = Mat4.identity();
    this.setupScene(graphics_state);
    this.movement();

    //draw avatar
    this.shapes.spike.draw(
      graphics_state,
      this.avatar_pos,
      this.materials.avatar
    );

    //draw reflected cases
    //plane mirror
    let copy = this.avatar_pos;
    let scale = 1;
    let reflected_mat = [
      copy[0],
      copy[1],
      [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
      copy[3]
    ];
    if (this.avatar_pos[0][3] >= -4 && this.avatar_pos[0][3] <= 4)
      this.shapes.spike.draw(
        graphics_state,
        reflected_mat,
        this.materials.avatar
      );
    //convex case will always be upright
    else if (this.avatar_pos[0][3] < -4) {
      scale =
        (-1 * this.mirror_eq(-3, this.avatar_pos[2][3])) /
        this.avatar_pos[2][3];
      copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.shapes.spike.draw(
        graphics_state,
        reflected_mat,
        this.materials.avatar
      );
    }
    //concave cases
    else if (this.avatar_pos[0][3] > 4) {
      //if needs to be inverted
      if (this.mirror_eq(3, this.avatar_pos[2][3]) > 0) {
        scale =
          this.mirror_eq(2, this.avatar_pos[2][3]) / this.avatar_pos[2][3];
        console.log(scale);
        copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
        reflected_mat = [
          copy[0],
          [-1 * copy[1][0], -1 * copy[1][1], -1 * copy[1][2], -1 * copy[1][3]],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
      } else {
        scale =
          (-1 * this.mirror_eq(3, this.avatar_pos[2][3])) /
          this.avatar_pos[2][3];
        copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
        reflected_mat = [
          copy[0],
          copy[1],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
      }
      this.shapes.spike.draw(
        graphics_state,
        reflected_mat,
        this.materials.avatar
      );
    }

    //camera coordinates
    let translate_back = Mat4.translation(Vec.of(0, 0, 10));
    if (typeof this.attached !== "undefined") {
      switch (this.attached()) {
        case this.initial_camera_location:
          graphics_state.camera_transform = Mat4.look_at(
            Vec.of(0, 5, 30),
            Vec.of(0, 0, 0),
            Vec.of(0, 1, 0)
          ).map((x, i) =>
            Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
        case this.mirror_1:
        case this.mirror_2:
        case this.mirror_3:
          graphics_state.camera_transform = Mat4.inverse(
            this.attached()
          ).map((x, i) =>
            Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
        case this.avatar:
          graphics_state.camera_transform = Mat4.inverse(
            this.avatar_pos.times(translate_back)
          ).map((x, i) =>
            Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
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

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 100), Vec.of(0, 0, 0), Vec.of(0, 1, 0));

            this.initial_camera_location = Mat4.identity()
                .times(Mat4.translation([-130,5,-10]))
                .times(Mat4.rotation(Math.PI/-2, [0,1,0]));

            context.globals.graphics_state.camera_transform = Mat4.inverse(this.initial_camera_location);

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                bar: new Cube(),
                cylinder: new Rounded_Capped_Cylinder(15,15,[2,2]),
                cone : new Closed_Cone(15, 15, [2,2]),
                flag: new Flag2(201),
                wing: new Windmill(4),
                wood: new Cube(),
                background_wall: new Cube(),
                beer: new Cylindrical_Tube(15, 15, [20,20]),
                triangle: new Triangle(),
                ground: new Cube(),
                sphere: new Subdivision_Sphere(4),
            };

            shapes.background_wall.texture_coords = shapes.background_wall.texture_coords.map(v => Vec.of(v[0] * 6, v[1] * 6));
            shapes.ground.texture_coords = shapes.ground.texture_coords.map(v => Vec.of(v[0] * 40, v[1] * 20));

            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            this.materials =
                {
                    bar : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1}),
                    dart : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 0.5, specularity: 1}),
                    cone : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
                    wing : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 0.5}),
                    board: context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/dart_board.png", true)}),
                    beer : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/heineken.png", true)}),
                    flag: context.get_instance(Flag_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/flag.png", true)}),
                    fire : context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1, specularity: 1}),
                    blue_fire : context.get_instance(Phong_Shader).material(Color.of(44/255,83/255,143/255,1), {ambient: 1, diffusivity: 1,}),
                    yellow_fire : context.get_instance(Phong_Shader).material(Color.of(1,189/255,46/255,1), {ambient: 1, diffusivity: 1,}),
                    fabric : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/classic.jpg", true)}),
                    table_wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/table_wood.jpg", true)}),
                    wood_tile : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1,  texture: context.get_instance("assets/high_res_wood_tile.jpg", true)}),
                    wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/wood.png", true)}),
                    white_wood : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/table_wood.jpg", true)}),
                    brick : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/brick.jpg", true)}),
                    marvel : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/fun.jpg", true)}),
                    silk : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/silk_fabric.jpg", true)}),
                    toystory : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/behind_dart.jpg", true)}),
                    photo_frame : context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient: 1}),
                };

            this.lights = [new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
                           new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
                           new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)];

            // physics variables
            this.max_power = 200;
            this.power = 0;
            this.power_x = 0;
            this.power_y = 0;
            this.power_z = 0;

            this.accel_x = 0.0;
            this.accel_y = -9.8; // gravity
            this.accel_z = 5.0;

            // 0 ~ 90 (up down), -90 ~ 90 (left right)
            this.up_down_angle = 0;
            this.left_right_angle = 0;

            // conditional variables
            this.charging = false;
            this.shoot = false;
            this.collision_computed = false;
            this.angle_up_start = false;
            this.angle_down_start = false;
            this.angle_left_start = false;
            this.angle_right_start = false;
            this.bulls_eye = false;
            this.stop_firework = true;
            this.fire_time = 0;

            //random firework
            this.random_v = [];
            this.random_g = [];
            this.random_x_angle = [];
            this.random_z_angle = [];
            this.random_direct = [];

            this.get_random();

            // time
            this.charging_start_time = 0;
            this.curr_time = 0;

            // transform: dart, board, power bar
            this.default_dart_pos = [-100 ,0, 0]; // default (based on the rightmost piece)
            this.dart_pos = [-100 ,0, 0]; // current dart position
            this.board_pos = [100,0,0]; // default
            this.bar_transform = Mat4.identity().times(Mat4.translation([10,0,0]));

            this.front_view = Mat4.identity()
                .times(Mat4.translation([-120,0,0]))
                .times(Mat4.rotation(-1*Math.PI/2, Vec.of(0,1,0)));

            this.score = 0;
            this.max_socre = 0;

        }

        make_control_panel() {
            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
            this.key_triggered_button("Charge", ["Enter"], this.start_charging, '#'+Math.random().toString(9).slice(-6), this.start_shoot);
            this.new_line();
            this.key_triggered_button("Angle Up", ["i"], this.angle_up, '#'+Math.random().toString(9).slice(-6), this.angle_up_release);
            this.key_triggered_button("Angle Down", ["k"], this.angle_down, '#'+Math.random().toString(9).slice(-6), this.angle_down_release);
            this.key_triggered_button("Angle Left", ["j"], this.angle_left, '#'+Math.random().toString(9).slice(-6), this.angle_left_release);
            this.key_triggered_button("Angle Right", ["l"], this.angle_right, '#'+Math.random().toString(9).slice(-6), this.angle_right_release);
            this.new_line();
            this.key_triggered_button("Restart", ["q"], this.restart, '#'+Math.random().toString(9).slice(-6));
            this.key_triggered_button("Front View", ["1"], ()=>this.attached=()=> this.front_view, '#'+Math.random().toString(9).slice(-6));
            this.key_triggered_button("Side View", ["2"],  ()=>this.attached=()=> this.initial_camera_location, '#'+Math.random().toString(9).slice(-6));
            this.key_triggered_button("Change Wind Direction", ["3"],  ()=>this.accel_z=this.accel_z*-1, '#'+Math.random().toString(9).slice(-6));
            this.key_triggered_button("More Wind", ["9"],  ()=>this.accel_z+= 1, '#'+Math.random().toString(9).slice(-6));
            this.key_triggered_button("Less Wind", ["0"],  ()=>this.accel_z-= 1, '#'+Math.random().toString(9).slice(-6));
        }

        start_charging() {
            console.log("Start charging");
            this.charging = true;
            this.shoot = false;
            this.charging_start_time = this.curr_time;
        }

        /* Key Event Handlers */
        start_shoot() {
            console.log("Shoot!");
            console.log(this.power);
            this.charging = false;
            this.shoot = true;
            this.decompose_power_x_y_z(this.power, this.up_down_angle, this.left_right_angle);
        }

        angle_up() {
            if (!this.angle_down_start) {
                this.angle_up_start = true;
            }
        }

        angle_up_release() {
            this.angle_up_start = false;
        }

        angle_down() {
            if (!this.angle_up_start) {
                this.angle_down_start = true;
            }
        }

        angle_down_release() {
            this.angle_down_start = false;
        }

        angle_left() {
            if (!this.angle_right_start) {
                this.angle_left_start = true;
            }
        }

        angle_left_release() {
            this.angle_left_start = false;
        }

        angle_right() {
            if (!this.angle_left_start) {
                this.angle_right_start = true;
            }
        }

        angle_right_release() {
            this.angle_right_start = false;
        }

        set_angle() {
            let one_move = Math.PI / 180;
            if (this.angle_up_start && this.up_down_angle < Math.PI/2) {
                this.up_down_angle += one_move;
            } else if (this.angle_down_start && this.up_down_angle > 0) {
                this.up_down_angle -= one_move;
            }

            if (this.angle_left_start && this.left_right_angle < Math.PI/2) {
                this.left_right_angle += one_move;
            } else if (this.angle_right_start && this.left_right_angle > -1* Math.PI/2) {
                this.left_right_angle -= one_move;
            }
        }

        set_bar_transform() {
            this.bar_transform = Mat4.identity()
                .times(Mat4.scale([1,10*(this.power/this.max_power),1]))
                .times(Mat4.translation([10,0,0]))
        }

        restart() {
            this.power = 0;
            this.left_right_angle = 0;
            this.up_down_angle = 0;

            // conditional variables
            this.charging = false;
            this.shoot = false;
            this.angle_up_start = false;
            this.angle_down_start = false;
            this.angle_left_start = false;
            this.angle_right_start = false;
            this.collision_computed = false;
            this.fire_time = 0;

            // transform: dart, board, power bar
            this.dart_pos = [-100,0,0]; // current dart position
            this.bar_transform = Mat4.identity().times(Mat4.translation([10,0,0]));
        }


        draw_table(graphics_state, x,y,z) {

            let x_offset = 900;
            let y_offset = -30;
            let z_offset = -100;
            let rot_angle = Math.PI / 2;

            // body
            let transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([0, -150, -450]))
                .times(Mat4.scale([300, 10, 100]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            // 4 legs (length: 100)
            // front 2 legs
            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([-150, -220, -400]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([150, -220, -400]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            // back 2 legs
            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([-150, -220, -500]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);

            transform = Mat4.identity()
                .times(Mat4.translation([x_offset, y_offset, z_offset]))
                .times(Mat4.rotation(rot_angle, Vec.of(0,1,0)))
                .times(Mat4.translation([150, -220, -500]))
                .times(Mat4.scale([10, 60, 10]));

            this.shapes.bar.draw(graphics_state, transform, this.materials.white_wood);
        }

        draw_left_wall(graphics_state) {
            let x = 500;
            let y = 200;
            let z = 10;
            let rot_angle = Math.PI/2;

            let transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,-400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,-200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,0]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,100,400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            // bottom part
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,-400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,-200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,0]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,200]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x,-100,400]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);


            // draw photo
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x-10,100,240]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,50,10]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.marvel);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x-10 + 5, 100,240]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([55,55,10]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.photo_frame);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x-10, 100,370]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,50,10]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.toystory);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([x-10 + 5, 100,370]));
            transform = transform.times(Mat4.rotation(rot_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([55,55,10]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.photo_frame);
        }

        draw_back_wall(graphics_state) {
            let x = -600;
            let y = 200;
            let z = 10;
            let rot_angle = Math.PI/2;

            let transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-400,100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-200,100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([0,100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([200,100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([400,100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            // bottom part
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-400,-100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([-200,-100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([0,-100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([200,-100,x]));
            transform = transform.times(Mat4.scale([50,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.wood);

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([400,-100,x]));
            transform = transform.times(Mat4.scale([150,y,z]));
            this.shapes.background_wall.draw(graphics_state, transform, this.materials.brick);
        }

        draw_background(graphics_state) {

            this.draw_table(graphics_state, 1,2,3);
            this.draw_left_wall(graphics_state);
            this.draw_back_wall(graphics_state);

            // ground
            let transform = Mat4.identity()
                .times(Mat4.translation([0,-300,0] ))
                .times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)))
                .times(Mat4.scale([700,700,0]));

            this.shapes.ground.draw(graphics_state, transform, this.materials.silk);



        }

        draw_firework(graphics_state, t) {
            let zero_to_one = 0.5 + 0.5*Math.sin(2 * Math.PI/3*t);
            // let color = Color.of( 1, 1, 1, 1 );

            this.stop_firework = true;
            for(let i = 0; i < 500; i++){
                let V = this.random_v[i];
                let g = this.random_g[i];
                let x_angle = this.random_x_angle[i];
                let z_angle = this.random_z_angle[i];

                let p_xy = V * Math.cos(x_angle);
                let p_xz = V * Math.cos(z_angle);
                let Vx = p_xy * Math.cos(z_angle);
                let Vy = p_xy * Math.sin(z_angle);
                let Vz = -1 * p_xz * Math.sin(x_angle);


                // let Vx = V * Math.cos(x_angle) * Math.cos(z_angle);
                // // if (x_angle < 0) Vx = V * -1* Math.cos(x_angle);
                // let Vy = V * Math.sin(x_angle) * Math.cos(z_angle);
                // let Vz = V * Math.cos(x_angle) * Math.sin(z_angle);
                let max_Y = Vy * Vy / (2 * g);

                let X = this.random_direct[i] * Vx* (t - this.fire_time);
                let Y = Vy*(t - this.fire_time) - g*(t - this.fire_time)*(t - this.fire_time)/2;
                let Z = this.random_direct[i] * Vz*(t - this.fire_time);
                let color = Color.of( Y/max_Y, zero_to_one, 0, 1 );
                if(Y > -10){
                    let transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([X,Y,Z]));
                    transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)));
                    transform = transform.times(Mat4.scale([0.5,0.5,0.5]));
                    this.shapes.sphere.draw(graphics_state, transform, this.materials.fire.override({color: color, ambient:Y}));
                    this.stop_firework = false;
                }
            }

        }

        draw_dart(graphics_state, t) {
            let x_offset = -19;
            let transform = Mat4.identity();

            if(this.shoot) {
                for (let i = 0; i < 4; i++) {
                    let ang = 1;

                    if (i == 0) ang = 1;
                    else if (i == 1) ang = 1 / 2;
                    else if (i == 2) ang = 1 / 4;
                    else if (i == 3) ang = -1 / 4;

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));


                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 20, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.blue_fire);

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));

                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 20, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.blue_fire);

                }

                for (let j = 0; j < 8; j++) {
                    let ang = 1;

                    if (j == 0) ang = 1 / 8;
                    else if (j == 1) ang = -1 / 8;
                    else if (j == 2) ang = 3 / 8;
                    else if (j == 3) ang = -3 / 8;
                    else if (j == 4) ang = 1 / 16;
                    else if (j == 5) ang = -1 / 16;
                    else if (j == 6) ang = 3 / 16;
                    else if (j == 7) ang = -3 / 16;

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));

                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 10, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.yellow_fire);

                    transform = Mat4.identity();
                    transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
                    transform = transform.times(Mat4.translation([10, 0, 0]));
                    transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0, 1, 0)));
                    transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.translation([-10, 0, 0]));

                    transform = transform.times(Mat4.rotation((Math.PI) * t * t * t, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation((Math.PI) * ang, Vec.of(1, 0, 0)));

                    transform = transform.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)));
                    transform = transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 0, 1)));
                    transform = transform.times(Mat4.scale([1, 10, 1]));
                    this.shapes.triangle.draw(graphics_state, transform, this.materials.yellow_fire);

                }
            }

            // dart piece 1
            x_offset = -19;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([10,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-10,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 2
            x_offset = -17;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([8,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-8,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([0.5,0.5,4]));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(103/255, 199/255, 235/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 3
            x_offset = -16;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([7,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-7,0,0]));
            transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 4
            x_offset = -12;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([3,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-3,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1,1,6]));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(170/255, 5/255, 5/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 5
            x_offset = -10;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([1,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([-1,0,0]));
            transform = transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1.3,1.3,2]));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(103/255, 199/255, 235/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));


            // dart piece 6
            x_offset = -5;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([-4,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([4,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1.3,1.3,6]));
            this.shapes.cylinder.draw(graphics_state, transform, this.materials.dart.override( {color: Color.of(170/255, 5/255, 5/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 7
            x_offset = 0;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.translation([-9,0,0]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([9,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1.3,1.3,2]));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(106/255, 12/255, 11/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));

            // dart piece 8 (rightmost)
            x_offset = -9;
            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([this.dart_pos[0] + x_offset, this.dart_pos[1], this.dart_pos[2]]));
            transform = transform.times(Mat4.rotation(this.left_right_angle, Vec.of(0,1,0)));
            transform = transform.times(Mat4.rotation(this.up_down_angle, Vec.of(0,0,1)));
            transform = transform.times(Mat4.translation([10,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([1,1,10]));
            this.shapes.cone.draw(graphics_state, transform, this.materials.cone.override( {color: Color.of(251/255, 202/255, 3/255, 1), ambient:0.3, specularity: 1, diffusivity: 1}));



            transform = Mat4.identity();
            // transform = transform.times(Mat4.translation([X,Y,0]));
            // transform = transform.times(Mat4.translation([-20,0,0]));
            // transform = transform.times(Mat4.rotation(cur_angle, Vec.of(0,0,1)));
            // transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            // transform = transform.times(Mat4([2,2,3]);
            // transform = transform.times(Mat4.scale([2,2,3]));
            // this.shapes.wing.draw(graphics_state, transform, this.materials.wing);
        }

        // based on z and y values
        compute_distance(p1, p2) {
            return Math.sqrt((p1[2] - p2[2]) ** 2 + (p1[1] - p2[1]) ** 2);
        }

        // Determine only based on x-axis
        // position can be vec3
        detect_collision(dart_pos, board_pos, board_rad) {
            if(this.collision_computed) return false;

            let x_offset = Math.abs(dart_pos[0] - board_pos[0]);

            if (x_offset <= 2 && this.compute_distance(dart_pos, board_pos) <= board_rad) {
                // collision
                return true;
            }
            return false;
        }

        get_random(){
            this.random_v = [];
            this.random_g = [];
            this.random_x_angle = [];
            this.random_z_angle = [];
            this.random_direct = [];
            for(let i = 0; i < 500; i++){
                this.random_v.push(Math.ceil(Math.random() * 20) + 10);
                this.random_g.push(Math.ceil(Math.random() * 20) + 10);
                this.random_x_angle.push(Math.PI/Math.ceil(Math.random() * 3));
                this.random_z_angle.push(Math.PI/Math.ceil(Math.random() * 3));
                if(Math.random()<0.5) this.random_direct.push(1);
                else this.random_direct.push(-1);
            }
            // console.log(this.random_v);
            // console.log(this.random_x_angle);
            // console.log(this.random_z_angle);
            // console.log(this.random_direct);
        }

        compute_score(dart_pos, board_pos, board_rad) {

            let z_offset = Math.abs(dart_pos[2] - board_pos[2]);
            let y_offset = Math.abs(dart_pos[1] - board_pos[1]);

            if (z_offset <= board_rad * 0.1 && y_offset <= board_rad * 0.1) {
                console.log("Bulls EYE");
                this.bulls_eye = true;
                this.get_random();
                this.score = 100;
            } else if (z_offset <= board_rad * 0.3 && y_offset <= board_rad * 0.3) {
                this.score = 70;
            } else if (z_offset <= board_rad * 0.5 && y_offset <= board_rad * 0.5) {
                this.score = 40;
            } else if (z_offset <= board_rad * 0.7 && y_offset <= board_rad * 0.7) {
                this.score = 10;
            } else {
                this.score = 0;
            }

            this.max_socre = Math.max(this.max_socre, this.score);
        }

        decompose_power_x_y_z(power, up_down_angle, left_right_angle) {
            let p_xy = power * Math.cos(left_right_angle);
            let p_xz = power * Math.cos(up_down_angle);
            this.power_x = p_xy * Math.cos(up_down_angle);
            this.power_y = p_xy * Math.sin(up_down_angle);
            this.power_z = -1 * p_xz * Math.sin(left_right_angle);
        }

        apply_accel(dt) {
            this.power_x += this.accel_x * dt;
            this.power_y += this.accel_y * dt;
            this.power_z += this.accel_z * dt;
        }

        update_dart_pos(dt) {
            this.dart_pos[0] += this.power_x * dt;
            this.dart_pos[1] += this.power_y * dt;
            this.dart_pos[2] += this.power_z * dt;
        }

        update_dart_angle() {
            this.up_down_angle = Math.atan(this.power_y / this.power_x);
            this.left_right_angle = -1 * Math.atan(this.power_z / this.power_x);
        }

        draw_board(graphics_state) {

            let transform = Mat4.identity();
            /*transform = transform.times(Mat4.translation([105,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([80,80,0]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.wood);*/

            transform = Mat4.identity();
            transform = transform.times(Mat4.translation([100,0,0]));
            transform = transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
            transform = transform.times(Mat4.scale([50,50,0]));
            this.shapes.bar.draw(graphics_state, transform, this.materials.board);
        }

        draw_flag(graphics_state) {
            let flag_loc;
            let flag_rot;
            let flag_x = 300;
            let flag_y = -100;
            let flag_z = -200;
            if (this.accel_z > 0) {
                flag_loc = [flag_x, flag_y, 0 + flag_z];
                flag_rot = 0;
            } else {
                flag_loc = [flag_x, flag_y,-40 + flag_z];
                flag_rot = Math.PI;
            }

            let flag_transform = Mat4.identity()
                .times(Mat4.translation(flag_loc))
                .times(Mat4.rotation(flag_rot, Vec.of(0,1,0)))
                .times(Mat4.rotation(Math.PI, Vec.of(1,0,0))) // upside down
                .times(Mat4.rotation(Math.PI / 2, Vec.of(0,1,0))) // same direction with the board
                .times(Mat4.scale([20,20,20]));

            let stick_transform = Mat4.identity()
                .times(Mat4.translation([flag_x,flag_y-10,-20 + flag_z]))
                .times(Mat4.scale([1,20,0.1]));

            this.shapes.bar.draw(graphics_state, stick_transform, this.materials.bar);
            this.shapes.flag.draw(graphics_state, flag_transform, this.materials.flag.override({ wind: this.accel_z } ) );
        }

        update_stat() {
            // look up the elements we want to affect
            document.getElementById("score").innerText = this.score.toFixed(2).toString();
            document.getElementById("max_score").innerText = this.max_socre.toFixed(2).toString();
            document.getElementById("power").innerText = this.power.toFixed(2).toString();
            document.getElementById("wind").innerText = this.accel_z.toFixed(2).toString();
            document.getElementById("up_down_angle").innerText = (this.up_down_angle * 180 / Math.PI).toFixed(2).toString(2);
            document.getElementById("left_right_angle").innerText = (this.left_right_angle * 180 / Math.PI).toFixed(2).toString(2);
        }

        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

            // charging
            if (this.charging) {
                this.power =  this.max_power * 0.5 * (Math.sin((t-this.charging_start_time) - 0.5 * Math.PI) + 1);
            } else {
                this.curr_time = t;
            }

            // set up the power charging bar
            // this.set_bar_transform();
            // this.shapes.bar.draw(graphics_state, this.bar_transform, this.materials.bar);

            if(this.shoot){
                this.apply_accel(dt);
                this.update_dart_pos(dt);
                this.update_dart_angle();
            } else {
                // when key pressed, adjust angle
                this.set_angle();
            }

            //firework
            if(this.bulls_eye) {
                this.fire_time = t;
                this.bulls_eye = false;
            }
            if(this.fire_time != 0){
                this.draw_firework(graphics_state, t);
                if(this.stop_firework) {
                    this.get_random();
                    this.fire_time = t;
                }
            }

            //draw five gray fabrics
            this.draw_background(graphics_state);

            // draw the dart that consists of 9 pieces
            this.draw_dart(graphics_state, t);
            // draw the board
            this.draw_board(graphics_state);

            //console.log(this.dart_pos);
            if (this.detect_collision(this.dart_pos, this.board_pos, 50)) {
                console.log("Detected Collision");
                this.shoot = false;
                this.compute_score(this.dart_pos, this.board_pos, 50);
                this.collision_computed = true;
            }

            // flag
            this.draw_flag(graphics_state);

            // set camera if necessary
            if (this.attached !== undefined) {
                graphics_state.camera_transform = Mat4.translation([0,0,-5]).times(Mat4.inverse(this.attached()))
                    .map( (x, i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 0.1 ));
            }

            this.update_stat();

        }
    };

class Flag_Shader extends Phong_Shader
{

    material( color, properties )     // Define an internal class "Material" that stores the standard settings found in Phong lighting.
    {
        return new class Material       // Possible properties: ambient, diffusivity, specularity, smoothness, gouraud, texture.
    { constructor( shader, color = Color.of( 0,0,0,1 ), ambient = 0, diffusivity = 1, specularity = 1, smoothness = 40, wind= 5.0)
    { Object.assign( this, { shader, color, ambient, diffusivity, specularity, smoothness, wind } );  // Assign defaults.
        Object.assign( this, properties );                                                        // Optionally override defaults.
    }
        override( properties )                      // Easily make temporary overridden versions of a base material, such as
        { const copied = new this.constructor();  // of a different color or diffusivity.  Use "opacity" to override only that.
            Object.assign( copied, this );
            Object.assign( copied, properties );
            copied.color = copied.color.copy();
            if( properties[ "opacity" ] != undefined ) copied.color[3] = properties[ "opacity" ];
            return copied;
        }
    }( this, color );
    }

    update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
    {
        // First, send the matrices to the GPU, additionally cache-ing some products of them we know we'll need:
        this.update_matrices( g_state, model_transform, gpu, gl );
        gl.uniform1f ( gpu.animation_time_loc, g_state.animation_time / 1000 );

        if( g_state.gouraud === undefined ) { g_state.gouraud = g_state.color_normals = false; }    // Keep the flags seen by the shader
        gl.uniform1i( gpu.GOURAUD_loc,        g_state.gouraud || material.gouraud );                // program up-to-date and make sure
        gl.uniform1i( gpu.COLOR_NORMALS_loc,  g_state.color_normals );                              // they are declared.

        gl.uniform4fv( gpu.shapeColor_loc,     material.color       );    // Send the desired shape-wide material qualities
        gl.uniform1f ( gpu.ambient_loc,        material.ambient     );    // to the graphics card, where they will tweak the
        gl.uniform1f ( gpu.diffusivity_loc,    material.diffusivity );    // Phong lighting formula.
        gl.uniform1f ( gpu.specularity_loc,    material.specularity );
        gl.uniform1f ( gpu.smoothness_loc,     material.smoothness  );
        gl.uniform1f ( gpu.wind_loc,           material.wind  );

        if( material.texture )                           // NOTE: To signal not to draw a texture, omit the texture parameter from Materials.
        { gpu.shader_attributes["tex_coord"].enabled = true;
            gl.uniform1f ( gpu.USE_TEXTURE_loc, 1 );
            gl.bindTexture( gl.TEXTURE_2D, material.texture.id );
        }
        else  { gl.uniform1f ( gpu.USE_TEXTURE_loc, 0 );   gpu.shader_attributes["tex_coord"].enabled = false; }

        if( !g_state.lights.length )  return;
        var lightPositions_flattened = [], lightColors_flattened = [], lightAttenuations_flattened = [];
        for( var i = 0; i < 4 * g_state.lights.length; i++ )
        { lightPositions_flattened                  .push( g_state.lights[ Math.floor(i/4) ].position[i%4] );
            lightColors_flattened                     .push( g_state.lights[ Math.floor(i/4) ].color[i%4] );
            lightAttenuations_flattened[ Math.floor(i/4) ] = g_state.lights[ Math.floor(i/4) ].attenuation;
        }
        gl.uniform4fv( gpu.lightPosition_loc,       lightPositions_flattened );
        gl.uniform4fv( gpu.lightColor_loc,          lightColors_flattened );
        gl.uniform1fv( gpu.attenuation_factor_loc,  lightAttenuations_flattened );
    }

    shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
        const int N_LIGHTS = 2;             // We're limited to only so many inputs in hardware.  Lights are costly (lots of sub-values).
        uniform float ambient, diffusivity, specularity, smoothness, animation_time, attenuation_factor[N_LIGHTS], wind;
        uniform bool GOURAUD, COLOR_NORMALS, USE_TEXTURE;               // Flags for alternate shading methods
        uniform vec4 lightPosition[N_LIGHTS], lightColor[N_LIGHTS], shapeColor;
        varying vec3 N, E;                    // Specifier "varying" means a variable's final value will be passed from the vertex shader 
        varying vec2 f_tex_coord;             // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the 
        varying vec4 VERTEX_COLOR;            // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 L[N_LIGHTS], H[N_LIGHTS];
        varying float dist[N_LIGHTS];
        varying float varSlope;
        `;
    }

    vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos, normal;
        attribute vec2 tex_coord;

        uniform mat4 camera_transform, camera_model_transform, projection_camera_model_transform;
        uniform mat3 inverse_transpose_modelview;

        void main()
        {   
          // FLAG Movement
          f_tex_coord = tex_coord;                                                           // Directly use original texture coords and interpolate between.          

          float x = tex_coord.x;
          float y = tex_coord.y;
          float t = abs(wind) * -1.0 * animation_time; // this contant value should be the power of wind
        
          float h = cos( t + x * 10.0 );
          h += cos( x * 3.0 - t * 0.1751 );
          y += h * x * 0.2;
                
          // compute slope
          float x2 = x - 0.001;
          float h2 = cos( t + x2 * 10.0 );
          h2 += cos( x2 * 3.0 - t * 0.1751 );
          varSlope = h - h2;
        
          gl_Position = projection_camera_model_transform * vec4( 2.0 * x - 1.0, 0.5 - y, 0.0, 1.0 );

        }`;
    }

    fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    {
        return `
        
        uniform sampler2D texture;

        void main()
        {
              // vec4 tex_color = vec4(0.73,0.41,0.01,1);
              vec4 tex_color = texture2D( texture, f_tex_coord);                         // Sample the texture image in the correct place.
              if( varSlope > 0.0 ) {
                tex_color = mix( tex_color, vec4(0,0,0,1), varSlope * 50.0 );
              }
              if( varSlope < 0.0 ) {
                tex_color = mix( tex_color, vec4(1,1,1,1), abs(varSlope) * 50.0 );
              }
              gl_FragColor = tex_color;
        }`;
    }
}
